export interface Account {
  name: string;
  id: number;
  avatar_url: string;
}

export const createAccount = async (
  db: D1Database,
  name: string,
  id: number,
  avatar_url: string
): Promise<boolean> => {
  const result = await db
    .prepare("INSERT INTO Accounts (name, id, avatar_url) VALUES (?1, ?2, ?3)")
    .bind(name, id, avatar_url)
    .run();
  return result.success;
};

export const updateAccount = async (
  db: D1Database,
  name: string,
  id: number,
  avatar_url: string
): Promise<boolean> => {
  const result = await db
    .prepare(
      "UPDATE Accounts SET name = ?1, id = ?2, avatar_url = ?3 WHERE name = ?1"
    )
    .bind(name, id, avatar_url)
    .run();
  return result.success;
};

export const getAccount = async (
  db: D1Database,
  id: number
): Promise<Account | null> => {
  const result = await db
    .prepare("SELECT * FROM Accounts WHERE id = ?1")
    .bind(id)
    .first();
  return result as Account | null;
};
