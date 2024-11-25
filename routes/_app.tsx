import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name={"color-scheme"} content={"light dark"} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>web_testbed</title>
        <link rel="stylesheet" href="/styles.css" />
        <link
          rel="stylesheet"
          href="/pico.classless.conditional.fuchsia.min.css"
        >
        </link>
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
