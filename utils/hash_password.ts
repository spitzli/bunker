import { hash, genSalt } from "bcrypt";

export async function hashPassword(password: string) {
  return await hash(password, await genSalt(14));
}
