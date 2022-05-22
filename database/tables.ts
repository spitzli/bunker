import { mammoth } from "../../deps.ts";

export const groups = mammoth.defineTable({
  name: mammoth.text().primaryKey().notNull(),
  permissions: mammoth.bigint().notNull(),
});

export const sessions = mammoth.defineTable({
  user_id: mammoth.bigint().primaryKey().notNull(),
  session_id: mammoth.text().primaryKey().notNull(),
  exp: mammoth.bigint().notNull(),
});

export const settings = mammoth.defineTable({
  id: mammoth.bigint().unique().notNull(),
  notify: mammoth.bool().default("true"),
  emailverify: mammoth.bool().default("false"),
});

export const customers = mammoth.defineTable({
  id: mammoth.bigint().primaryKey().notNull(),
  customer: mammoth.int().unique().notNull(),
  name: mammoth.text().notNull(),
  surname: mammoth.text().notNull(),
  avatar_url: mammoth.text().notNull(),
  company: mammoth.text(),
  email: mammoth.text().unique().notNull(),
  address1: mammoth.text(),
  address2: mammoth.text(),
  city: mammoth.text(),
  state: mammoth.text(),
  postcode: mammoth.text(),
  country: mammoth.text(),
  phonenumber: mammoth.text(),
});

export const users = mammoth.defineTable({
  id: mammoth.bigint().primaryKey().notNull(),
  customer: mammoth.int().unique().notNull(),
  email: mammoth.text().unique().notNull(),
  username: mammoth.text().unique().notNull(),
  password: mammoth.text(),
  permissions: mammoth.bigint().notNull().default("2"),
  groups: mammoth
    .array(mammoth.text())
    .notNull()
    .default("ARRAY['USER']::TEXT[]"),
});
