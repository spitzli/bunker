import { parse } from "std/encoding/yaml.ts";
import { bold, brightBlue, brightRed, brightYellow } from "std/fmt/colors.ts";
import { Router } from "oak";
import ReactDOMServer from "react";
import React from "react";
import db from "database";
import { Context, Config } from "types";
import { logger } from "utils";
import { configs } from "config";

const log = logger({
  name: "Module",
  logLevel: configs.general.env === "dev" ? 0 : 1,
});

export default abstract class Module {
  config: Config;
  constructor(path: string) {
    this.config = parse(
      new TextDecoder("utf-8").decode(Deno.readFileSync(`${path}/config.yml`))
    ) as Config;
    if (this.config.router !== undefined)
      this.router = new Router({ prefix: this.config.router?.prefix });
    if (this.config.router?.api !== undefined)
      this.api = new Router({ prefix: "/api" });
    this.db = db;
  }

  public readonly router: Router<Record<string, Context>> | undefined;

  public readonly api: Router<Record<string, Context>> | undefined;

  public readonly db;

  public readonly dependencies: string[] = [];

  public loaded = false;

  public readonly requiredIn: string[] = [];

  abstract load(): Promise<void> | void;
  abstract unload(): Promise<void> | void;
  public async depend(
    cache: Map<string, Module>,
    stack: Set<string>
  ): Promise<boolean> {
    if (stack.has(this.config.name)) {
      log.error(
        `detected loop in ${[...stack.values(), this.config.name]
          .map((mod) =>
            bold((mod === this.config.name ? brightBlue : brightYellow)(mod))
          )
          .join(bold(brightRed(" -> ")))}`
      );
      return false;
    }
    stack.add(this.config.name);
    const missingDependencies = this.dependencies.filter(
      (dependency: string) => !cache.get(dependency)
    );
    if (missingDependencies.length > 0) {
      log.error(
        `cannot find ${
          missingDependencies.length === 1 ? "dependency" : "dependendcies"
        } ${missingDependencies
          .map((dep) => bold(brightRed(dep)))
          .join(", ")} of ${bold(brightYellow(this.config.name))}`
      );

      log.info(
        `skip ${bold(brightYellow(this.config.name))} and continue loading...`
      );

      return false;
    }

    for (const dependency of this.dependencies) {
      const module = cache.get(dependency);

      if (!module) {
        // if that happens then I do not know any more lg Newt
        log.error("you somehow fucked your system, congrats!");

        return false;
      }

      if (!module.loaded) {
        if (!(await module.depend(cache, stack))) {
          log.error(
            `module ${bold(brightYellow(dependency))} could not be loaded`
          );

          return false;
        }

        try {
          await module.load();
          log.info(`module ${bold(brightYellow(module.config.name))} loaded`);
          stack.delete(module.config.name);
        } catch (e) {
          log.error(e);
          return false;
        }
      }
    }
    return true;
  }
  async reload(cache: Map<string, Module>): Promise<boolean> {
    if (this.loaded) {
      try {
        await this.unload();
        log.info(`unloaded ${bold(brightYellow(this.config.name))}`);
      } catch (e) {
        log.error(e);
        return false;
      }
    }
    if (!this.depend(cache, new Set<string>())) return false;
    try {
      await this.load();
      log.info(`reloaded ${bold(brightYellow(this.config.name))}`);
      return true;
    } catch (e) {
      log.error(e);
      return false;
    }
  }

  activate() {}

  deactivate() {}
}
