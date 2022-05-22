import { Router } from "./deps.ts";
import { walk } from "https://deno.land/std@0.99.0/fs/walk.ts";
import { formatTime, logger } from "./src/utils/mod.ts";
import ModuleLoader from "./src/modules/loader.ts";

const start = Date.now();
logger.info("Starting to Register all Routes");

export const router = new Router();

ModuleLoader.cache.forEach((module) => {
  const start = Date.now();
  if (module.config.router === undefined) return;
  router.use(module.router!.routes());
  logger.info(`Register Module Routes from ${module.config.name} || ${formatTime(Date.now() - start)}`);
});

logger.info(`All Routes Registerd || ${formatTime(Date.now() - start)}`);
