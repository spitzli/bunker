import Module from "../../classes/module.ts";
import Route from "../../classes/route.ts";
import App from "./frontend/App.tsx";
import { Context } from "../../types/mod.ts";
import { React } from "../../../deps.ts";
import { render } from "../../utils/render.tsx";

export default class BugTracker extends Module {
  load() {
    
    
    this.router?.get("/test", (context) => {
      return render(context, <App />);
    });
  }
  unload() {
    
    //database.close();
  }
}
