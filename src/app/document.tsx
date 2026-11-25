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
        <script
          // eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml -- Trusted and static.
          dangerouslySetInnerHTML={{
            __html: `
              window.goatcounter = {
                path: function (p) {
                  return location.host + p;
                },
              };
            `,
          }}
        />
        <script
          data-goatcounter="https://marrone.goatcounter.com/count"
          async
          src="https://gc.zgo.at/count.js"
        ></script>
      </head>
      <body>
        {children}
        <script>import("/src/client.tsx")</script>
      </body>
    </html>
  );
}
