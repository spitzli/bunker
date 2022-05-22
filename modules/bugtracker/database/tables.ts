import { mammoth } from "../../../../deps.ts";

export const test = mammoth.defineTable({
  name: mammoth.text().primaryKey(),
  permissions: mammoth.bigint().notNull(),
});

export const daniel = mammoth.defineTable({
  name: mammoth.text().primaryKey(),
  permissions: mammoth.bigint().notNull(),
});
