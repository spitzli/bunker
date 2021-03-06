import { Application } from "oak";
import { formatTime, logger } from "./src/utils/mod.ts";
import { router } from "./router.ts";
import { StateContext } from "./src/types/mod.ts";
import * as middlewares from "./src/middlewares/middlewares.ts";
import { configs } from "./configs.ts";
import ModuleLoader from "./src/modules/loader.ts";

const start = Date.now();

await ModuleLoader.load();

/* //Migrations
const migration = Deno.run({
  cmd: [
    "deno",
    "run",
    "--allow-read",
    "--allow-net",
    "--allow-env",
    "--unstable",
    "--no-check",
    "https://deno.land/x/nessie@2.0.4/cli.ts",
    "migrate",
  ],
});

await migration.status(); */

//await cacheGroups();

logger.setLevel(1);

const app = new Application<StateContext>();

app.addEventListener("listen", ({ port }) => {
  logger.info(
    `Server is Ready and Listen on ${
      configs.general.hostname == "localhost" ? "http" : "https"
    }://${configs.general.hostname}:${port} || ${formatTime(
      Date.now() - start
    )}`
  );
});

// * Middlerwares
app.use(middlewares.loggerMiddleware);
app.use(middlewares.timingMiddleware);
app.use(middlewares.errorMiddleware);
//app.use(middlewares.fernetMiddleware);

// Routers
app.use(router.routes());
app.use(router.allowedMethods());

// Static Routes (404 etc)
app.use(middlewares.fileMiddleware);
app.use(middlewares.notFound);

// App Login
app.listen({ port: 8080 });
