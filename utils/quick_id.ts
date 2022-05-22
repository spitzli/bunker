import { nanoid } from "nanoid";

export function quickId(): string {
  return `${Date.now().toString(32)}.${nanoid()}`;
}
