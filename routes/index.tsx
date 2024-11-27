import { walk } from "$std/fs/walk.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";

interface IHandlerData {
  route_names: string[];
}

export const handler: Handlers<IHandlerData> = {
  async GET(_req, ctx) {
    const route_names: string[] = [];

    for await (
      const file of walk("./routes", {
        includeSymlinks: false,
        exts: ["tsx"],
        skip: [/_404.tsx/, /_app.tsx/, /home.tsx/, /index.tsx/],
      })
    ) {
      route_names.push(file.name.split(".")[0]);
    }

    return await ctx.render({ route_names: route_names });
  },
};

export default function Home(props: PageProps<IHandlerData>) {
  const { route_names } = props.data;

  return (
    <MainDiv>
      <CenterDiv>
        <div
          className={"flex flex-col justify-center content-center gap-y-2.5"}
        >
          {route_names.map((name) => (
            <a
              className={"animated_link text-3xl"}
              href={`/${name}`}
              key={name}
            >
              Go to {name}
            </a>
          ))}
        </div>
      </CenterDiv>
    </MainDiv>
  );
}
