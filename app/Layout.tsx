import { React } from "../../deps.ts";

export default function Layout(body: any) {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

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
        <div id="root" className="wrapper">
          <div className="content-wrapper">{body}</div>
        </div>
      </body>
    </html>
  );
}
