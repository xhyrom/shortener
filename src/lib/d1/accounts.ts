import { getInvite } from "./invites";

export interface Account {
  name: string;
  id: number;
  avatar_url: string;
}

export const createAccount = async (
  db: D1Database,
  name: string,
  id: number,
  avatar_url: string,
  invite: string
): Promise<boolean> => {
  //const validInvite = (await getInvite(db, invite)) !== undefined;
  //if (!validInvite) return false;

  const result = await db
    .prepare("INSERT INTO Accounts (name, id, avatar_url) VALUES (?1, ?2, ?3)")
    .bind(name, id, avatar_url)
    .run();
  return result.success;
};

export const getAccount = async (
  db: D1Database,
  name: string
): Promise<Account | undefined> => {
  const result = await db
    .prepare("SELECT * FROM Accounts WHERE name = ?1")
    .bind(name)
    .run();
  return result.results?.[0] as Account | undefined;
};
