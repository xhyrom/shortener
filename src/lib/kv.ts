interface Link {
  code: string;
  target: string;
  ttl?: number;
}

interface Stats {
  visits: number;
}

type LinkWithStats = Link & Stats;

export const getLink = async (db: KVNamespace, code: string): Promise<Link> => {
  return await db.get(`links/${code}`, {
    cacheTtl: 60,
    type: "json",
  });
};

export const getLinkWithStats = async (
  db: KVNamespace,
  code: string
): Promise<LinkWithStats> => {
  const data = await getLink(db, code);
  if (!data) return;

  const stats = await db.get<Stats>(`stats/${code}`, {
    cacheTtl: 60,
    type: "json",
  });

  return {
    ...data,
    visits: stats?.visits || 0,
  };
};

export const getLinks = async (db: KVNamespace) => {
  const links = await db.list<Link[]>({ prefix: "links/" });
  const result: Promise<LinkWithStats>[] = [];

  for (const link of links.keys)
    result.push(getLinkWithStats(db, link.name.slice(6)));

  return (await Promise.all(result)).sort((a, b) => b.visits - a.visits);
};

export const createLink = async (
  db: KVNamespace,
  code: string,
  target: string,
  ttl?: number
): Promise<Link> => {
  if (ttl && ttl < 60) ttl = 60; // minimum 60 seconds

  const options: KVNamespacePutOptions = ttl ? { expirationTtl: ttl } : {};

  await db.put(
    `links/${code}`,
    JSON.stringify({
      target,
      created: new Date().toISOString(),
    }),
    options
  );

  return {
    code,
    target,
    ttl,
  };
};

export const deleteLink = async (
  db: KVNamespace,
  code: string
): Promise<boolean> => {
  const link = await getLink(db, code);
  if (!link) return false;

  await db.delete(`links/${code}`);
  return true;
};

// TODO: track visits
