import { configs } from "config";
import { createFernet } from "fernet";

export const Client = createFernet(configs.fernet.client.secret);

export const Application = createFernet(configs.fernet.application.secret);

export const Bearer = createFernet(configs.fernet.bearer.secret);
