import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import path from "node:path";

loadEnvConfig(path.resolve(__dirname, ".."));

const hash = process.env.ADMIN_PASSWORD_HASH ?? "";
const username = process.env.ADMIN_USERNAME ?? "";

console.log("ADMIN_USERNAME:", JSON.stringify(username));
console.log("ADMIN_PASSWORD_HASH length:", hash.length);
console.log("Valid bcrypt format:", /^\$2[aby]\$\d{2}\$.{53}$/.test(hash));

if (hash.length < 60) {
  console.error("");
  console.error("ERROR: Hash looks corrupted. Next.js expands $ in .env — escape each $ as \\$");
  process.exit(1);
}

const testPassword = process.argv[2];
if (testPassword) {
  console.log("Password match:", bcrypt.compareSync(testPassword, hash));
}
