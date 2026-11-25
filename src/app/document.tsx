import stylesURL from "./global.css?url";
import faviconURL from "../assets/favicon.svg";

export function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>NYC Open Jams</title>
        <link rel="stylesheet" href={stylesURL} />
        <link rel="icon" href={faviconURL} />
        <link rel="modulepreload" href="/src/client.tsx" />

        <script>
          {"window.goatcounter = { path: (p) => location.host + p };"}
        </script>
        <script
          data-goatcounter="https://marrone.goatcounter.com/count"
          src="https://gc.zgo.at/count.js"
          // The goatcounter docs recommend loading this script with `async`, not `defer`,
          // but React mishandles that and hoists this script above the `path` fixup above,
          // messing up their execution order.
          defer
        ></script>
      </head>
      <body>
        {children}
        <script>import("/src/client.tsx")</script>
      </body>
    </html>
  );
}
