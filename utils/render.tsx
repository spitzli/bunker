import ReactDOMServer from "react";
import React from "https://esm.sh/react-dom@18.1.0";
import Navbar from "../app/Navbar.tsx";
import Sidebar from "../app/Sidebar.tsx";
import { Context } from "../types/mod.ts";

export function render(context: Context, body: any) {
  try {
    context.response.body = ReactDOMServer.renderToString(
      <html>
        <head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          <title>OwO</title>

          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback"
          />
          <link
            rel="stylesheet"
            href="/plugins/fontawesome-free/css/all.min.css"
          />
          <link
            rel="stylesheet"
            href="/plugins/overlayScrollbars/css/OverlayScrollbars.min.css"
          />
          <script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css"
          />
        </head>
        <body className="hold-transition dark-mode sidebar-mini layout-fixed layout-navbar-fixed layout-footer-fixed">
          <div className="wrapper">
            {/*             <div className="preloader flex-column justify-content-center align-items-center">
              <img
                className="animation__wobble"
                src="/img/AdminLTELogo.png"
                alt="AdminLTELogo"
                height="60"
                width="60"
              />
            </div> */}
            <Navbar />
            <Sidebar />
            <div id="root" className="content-wrapper">
              {body}
            </div>
            <footer className="main-footer">
              <strong>
                Copyright &copy; 2014-2021
                <a href="https://adminlte.io">AdminLTE.io</a>.
              </strong>
              All rights reserved.
              <div className="float-right d-none d-sm-inline-block">
                <b>Version</b> 3.2.0
              </div>
            </footer>
          </div>
          <script src="/plugins/jquery/jquery.min.js"></script>
          <script src="/plugins/bootstrap/js/bootstrap.bundle.min.js"></script>
          <script src="/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js"></script>
          <script src="/plugins/jquery-mousewheel/jquery.mousewheel.js"></script>
          <script src="/plugins/raphael/raphael.min.js"></script>
          <script src="/plugins/jquery-mapael/jquery.mapael.min.js"></script>
          <script src="/plugins/jquery-mapael/maps/usa_states.min.js"></script>
          <script src="/plugins/chart.js/Chart.min.js"></script>
        </body>
      </html>
    );
  } catch (error) {
    console.error(error);
  }
}
