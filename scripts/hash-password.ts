import { hashAdminPassword } from "../lib/auth/password";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.ts <password>");
  process.exit(1);
}

const hash = hashAdminPassword(password);
const envValue = hash.replace(/\$/g, "\\$");

console.log("Hash:");
console.log(hash);
console.log("");
console.log("Add to .env (escape $ for Next.js):");
console.log(`ADMIN_PASSWORD_HASH="${envValue}"`);
