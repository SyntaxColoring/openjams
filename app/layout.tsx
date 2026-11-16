export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
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
          src="//gc.zgo.at/count.js"
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
