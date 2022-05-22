import Module from "../classes/module.ts";
import { walkSync } from "fs/walk.ts";
import { logger } from "../utils/mod.ts";
import { bold, brightYellow } from "fmt/colors.ts";
import Config from "../classes/types/config.ts";
import Metadata, { Permission } from "../classes/types/config.ts";
import Validation from "../classes/types/validation.ts";
import { configs } from "config";

const log = logger({
  name: "Module Loader",
  logLevel: configs.general.env === "dev" ? 0 : 1,
});

export default class ModuleLoader {
  static readonly cache: Map<string, Module> = new Map();
  static async load(): Promise<Map<string, Module>> {
    for (const entry of walkSync("./src/modules", {
      includeFiles: false,
      maxDepth: 1,
    })) {
      if (
        entry.name === "modules" ||
        entry.name === "database" ||
        entry.name === "imports"
      )
        continue;
      const module: Module = new (
        await import(`./${entry.name}/mod.tsx`)
      ).default(`./src/modules/${entry.name}`);
      if (
        !ModuleLoader.validateConfigs(module.config, [
          {
            key: "name",
            type: "string",
            isArray: false,
            required: true,
            defaultValue: "ModuleName",
          },
          {
            key: "version",
            type: "string",
            isArray: false,
            required: true,
            defaultValue: "1.0.0",
          },
          {
            key: "authors",
            type: "string",
            isArray: true,
            required: true,
            defaultValue: "TieCMS",
          },
          {
            key: "website",
            type: "string",
            isArray: false,
            required: false,
            defaultValue: "tiecms.dev",
          },
          {
            key: "description",
            type: "string",
            isArray: false,
            required: false,
            defaultValue: "Default Module Description",
          },
          {
            key: "permissions",
            type: "object",
            isArray: true,
            required: false,
            nested: [
              {
                key: "[permission]",
                type: "object",
                isArray: false,
                required: false,
                nested: [
                  {
                    key: "description",
                    type: "string",
                    isArray: false,
                    required: false,
                  },
                  {
                    key: "default",
                    type: "boolean",
                    isArray: false,
                    required: false,
                  },
                ],
              },
            ],
          },
          {
            key: "dependencies",
            type: "string",
            isArray: true,
            required: false,
            defaultValue: "tiecms.dev",
          },
          {
            key: "router",
            type: "object",
            isArray: false,
            required: false,
            nested: [
              {
                key: "prefix",
                type: "string",
                isArray: false,
                required: false,
              },
              {
                key: "api",
                type: "boolean",
                isArray: false,
                required: false,
              },
            ],
          },
        ])
      ) {
        log.error(
          `module ${
            bold(brightYellow(module.config.name)) ||
            bold(brightYellow("undefined"))
          } could not be loaded`
        );

        continue;
      }
      this.cache.set(module.config.name, module);
    }

    for (const module of this.cache.values()) {
      if (module.loaded) continue;

      if (!(await module.depend(this.cache, new Set<string>()))) {
        log.error(
          `module ${bold(brightYellow(module.config.name))} could not be loaded`
        );

        continue;
      }

      try {
        await module.load();
        log.info(`module ${bold(brightYellow(module.config.name))} loaded`);
        module.loaded = true;
      } catch (e) {
        log.error(e);
        continue;
      }
    }

    return this.cache;
  }

  static async reload() {
    for (const module of this.cache.values()) {
      if (!module.loaded) continue;
      module.reload(this.cache);
    }
    await this.load();
  }

  static validateConfig(config: Config) {
    return this.validateConfigs(config, [
      {
        key: "name",
        type: "string",
        isArray: false,
        required: true,
        defaultValue: "ModuleName",
      },
      {
        key: "version",
        type: "string",
        isArray: false,
        required: true,
        defaultValue: "1.0.0",
      },
      {
        key: "authors",
        type: "string",
        isArray: true,
        required: true,
        defaultValue: "TieCMS",
      },
      {
        key: "website",
        type: "string",
        isArray: false,
        required: false,
        defaultValue: "tiecms.dev",
      },
      {
        key: "description",
        type: "string",
        isArray: false,
        required: false,
        defaultValue: "Default Module Description",
      },
      {
        key: "permissions",
        type: "object",
        isArray: true,
        required: false,
        nested: [
          {
            key: "[permission]",
            type: "object",
            isArray: false,
            required: false,
            nested: [
              {
                key: "description",
                type: "string",
                isArray: false,
                required: false,
              },
              {
                key: "default",
                type: "boolean",
                isArray: false,
                required: false,
              },
            ],
          },
        ],
      },
      {
        key: "dependencies",
        type: "string",
        isArray: true,
        required: false,
        defaultValue: "tiecms.dev",
      },
      {
        key: "router",
        type: "object",
        isArray: false,
        required: false,
        nested: [
          {
            key: "prefix",
            type: "string",
            isArray: false,
            required: false,
          },
          {
            key: "api",
            type: "boolean",
            isArray: false,
            required: false,
          },
        ],
      },
    ]);
  }

  static validateConfigs(configs: Config, validations: Validation[]) {
    if (configs === null) return;
    for (const validation of validations) {
      const { key, required, type, defaultValue, isArray, nested } = validation;

      const config = configs[key as keyof Config];
      if (required && config === undefined) {
        log.error(`${key} is required!`);
        return false;
      }

      if (config !== undefined) {
        if (isArray) {
          if (!Array.isArray(config)) {
            log.error(`${key} must be a ${type} array`);
            return false;
          }
        }

        if (typeof config !== (isArray ? "object" : type)) {
          log.error(
            `typeof ${key} must be a ${isArray ? `${type} array` : type}`
          );
          return false;
        }

        if (isArray && Array.isArray(config)) {
          for (const value of config) {
            if (typeof value !== type) {
              log.error(`typeof ${key} must be a ${type} array`);
              return false;
            }
          }

          if (nested !== undefined) {
            for (const nest of nested) {
              for (const data of config) {
                //@ts-ignore
                this.validateConfigs(data[Object.keys(data)], nest.nested);
              }
            }
          }
        }
        if (nested !== undefined) {
          for (const nest of nested) {
            this.validateConfigs(config as Config, nested);
          }
        }
      }
    }
    return true;
  }
}

log.setLevel(0);
console.time("time");
await ModuleLoader.load();
console.timeEnd("time");
