import Module from "../../classes/module.ts";
import { React } from "../../../deps.ts";
import { render } from "../../utils/render.tsx";
import { Context } from "../../types/context.ts";
import Index from "./frontend/index.tsx";

export default class Core extends Module {
  load() {
    this.router?.get("/", (context: Context) => {
      render(
        context,
        <React.StrictMode>
          <Index />
        </React.StrictMode>
      );
    });
  }
  unload() {}
}
