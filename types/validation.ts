import Config, { Permission, Router } from "./config.ts";

export default interface Validation {
  key: keyof Config | "[permission]" | keyof Permission | keyof Router;
  //entry: unknown;
  type: "string" | "boolean" | "object";
  isArray: boolean;
  required: boolean;
  defaultValue?: string | string[] | boolean;
  nested?: Validation[];
}
