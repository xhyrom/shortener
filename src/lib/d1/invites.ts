import { customAlphabet } from "nanoid"
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 10);

export const createInvite = async(db: D1Database, authorId: string) => {
  const code = nanoid();

  const result = await db.prepare("INSERT INTO Invites (code, author_id) VALUES (?1, ?2)").bind(code, authorId).run();
  return result.success;
}

export const deleteInvite = async(db: D1Database, code: string) => {
  const result = await db.prepare("DELETE FROM Invites WHERE code = ?1").bind(code).run();
  return result.success;
}

export const getInvite = async(db: D1Database, code: string) => {
  const result = await db.prepare("SELECT * FROM Invites WHERE code = ?1").bind(code).run();
  return result.results;
}

export const getInvites = async(db: D1Database) => {
  const result = await db.prepare("SELECT * FROM Invites").run();
  return result.results;
}