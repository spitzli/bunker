import { ValidationErrors } from "validasaur";

export function getErrorMessage(errors: ValidationErrors) {
  const attrErrors = errors[Object.keys(errors)[0]];
  return attrErrors[Object.keys(attrErrors)[0]] as string;
}
