import { Context as OakContext } from "oak";

export interface StateContext {
  user?: User;
  application?: Application;
  bearer?: Bearer;
  tokenType?: string;
}

export type Context = OakContext<StateContext>;

export interface User {
  id: bigint;
  username: string;
  email: string;
  permissions: bigint;
  groups: string[];
  avatarUrl: string;
  sessionId: string;
  expires: number;
}

export interface Application {
  owner: bigint;
}

export interface Bearer {
  scopes: string[];
}
