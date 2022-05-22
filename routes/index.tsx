import { ReactDOMServer, React, Router } from "../../deps.ts";
import { sendEta } from "../helpers/send_eta.ts";
import ModuleLoader from "../modules/loader.ts";
import { Context } from "../types/context.ts";
import { render } from "../utils/render.tsx";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/logo.svg" className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export const router = new Router();
router.get("/", (context: Context) => {
  //ModuleLoader.cache.get("BugTracker")?.reload(ModuleLoader.cache);
  render(
    context,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

export default router;
