import Module from "../../classes/module.ts";
import Route from "../../classes/route.ts";
import App from "./frontend/App.tsx";
import { Context } from "../../types/mod.ts";
import { React } from "../../../deps.ts";
import { render } from "../../utils/render.tsx";

export default class BugTracker extends Module {
  load() {
    console.log("I AM LOADED BUG");
    console.log(this.config.name);
    this.router?.get("/test", (context) => {
      return render(context, <App />);
    });
  }
  unload() {
    console.log("I AM UNLODAED BUG");
    //database.close();
  }
}
