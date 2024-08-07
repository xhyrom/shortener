export interface Link {
  code: string;
  target: string;
  ttl?: number;
}

interface Stats {
  visits: number;
}

type LinkWithStats = Link & Stats;

export const getLink = async (
  db: KVNamespace,
  code: string,
): Promise<Link | null> => {
  const data = (await db.get(`links/${code}`, {
    cacheTtl: 300,
    type: "json",
  })) as Link | null;

  return data
    ? {
        ...data,
        code,
      }
    : null;
};

export const getLinkStats = async (
  db: KVNamespace,
  code: string,
): Promise<Stats | null> => {
  return await db.get<Stats>(`stats/${code}`, {
    cacheTtl: 300,
    type: "json",
  });
};

export const getLinkWithStats = async (
  db: KVNamespace,
  code: string,
): Promise<LinkWithStats | null> => {
  const data = await getLink(db, code);
  if (!data) return null;

  const stats = await getLinkStats(db, code);

  return {
    ...data,
    visits: stats?.visits || 0,
  };
};

export const getLinks = async (db: KVNamespace) => {
  const links = await db.list<Link[]>({ prefix: "links/" });
  const result: Promise<LinkWithStats>[] = [];

  for (const link of links.keys)
    result.push(
      getLinkWithStats(db, link.name.slice(6)) as Promise<LinkWithStats>,
    );

  return (await Promise.all(result)).sort((a, b) => b.visits - a.visits);
};

export const createLink = async (
  db: KVNamespace,
  code: string,
  target: string,
  ttl?: number,
): Promise<Link> => {
  if (ttl && ttl < 60) ttl = 60; // minimum 60 seconds

  const options: KVNamespacePutOptions = ttl ? { expirationTtl: ttl } : {};

  await db.put(
    `links/${code}`,
    JSON.stringify({
      target,
      created: new Date().toISOString(),
    }),
    options,
  );

  return {
    code,
    target,
    ttl,
  };
};

export const deleteLink = async (
  db: KVNamespace,
  code: string,
): Promise<boolean> => {
  const link = await getLink(db, code);
  if (!link) return false;

  await db.delete(`links/${code}`);
  return true;
};

export const recentlyVisited = async (
  db: KVNamespace,
  code: string,
  ip: string,
) => {
  return !!(await db.get(`stats/${code}/${ip}/tracked`));
};

export const track = async (db: KVNamespace, code: string, ip: string) => {
  if (await recentlyVisited(db, code, ip)) return;

  const stats = (await getLinkStats(db, code)) ?? { visits: 0 };
  stats.visits++;

  await Promise.all([
    db.put(`stats/${code}/${ip}/tracked`, "true", { expirationTtl: 3600 }), // 1 hour
    db.put(`stats/${code}`, JSON.stringify(stats)),
  ]);
};
