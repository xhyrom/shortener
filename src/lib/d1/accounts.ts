import { getInvite } from "./invites";

interface Account {
  username: string;
  password: string;
}

export const createAccount = async(db: D1Database, username: string, password: string, invite: string): Promise<boolean> => {
  const validInvite = (await getInvite(db, invite)) !== undefined;
  if (!validInvite) return false;

  const result = await db.prepare("INSERT INTO Accounts (username, password) VALUES (?1, ?2)").bind(username, password).run();
  return result.success;
}

export const getAccount = async(db: D1Database, username: string): Promise<Account | undefined> => {
  const result = await db.prepare("SELECT * FROM Accounts WHERE username = ?1").bind(username).run();
  return result.results?.[0] as Account | undefined;
}