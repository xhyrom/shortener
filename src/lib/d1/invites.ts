import { customAlphabet } from "nanoid";
const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  10
);

export interface Invite {
  code: string;
  author_id: string;
}

export const createInvite = async (
  db: D1Database,
  authorId: string
): Promise<boolean> => {
  const code = nanoid();

  const result = await db
    .prepare("INSERT INTO Invites (code, author_id) VALUES (?1, ?2)")
    .bind(code, authorId)
    .run();
  return result.success;
};

export const deleteInvite = async (
  db: D1Database,
  code: string
): Promise<boolean> => {
  const result = await db
    .prepare("DELETE FROM Invites WHERE code = ?1")
    .bind(code)
    .run();
  return result.success;
};

export const getInvite = async (
  db: D1Database,
  code: string
): Promise<Invite | null> => {
  const result = await db
    .prepare("SELECT * FROM Invites WHERE code = ?1")
    .bind(code)
    .first();
  return result as Invite | null;
};

export const getInvites = async (db: D1Database): Promise<Invite[] | null> => {
  const result = await db.prepare("SELECT * FROM Invites").all();
  return result.results as Invite[] | null;
};
