import bcrypt from "bcryptjs";

export function verifyAdminPassword(password: string): boolean {
  const username = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;

  if (!username || !hash) {
    return false;
  }

  return bcrypt.compareSync(password, hash);
}

export function hashAdminPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}
