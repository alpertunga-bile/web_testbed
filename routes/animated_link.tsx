import { PageProps } from "$fresh/server.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";

export default function AnimatedLink(_props: PageProps) {
  return (
    <MainDiv>
      <CenterDiv>
        <a href={"/home"} className={"animated_link text-4xl"}>
          GO TO THE HOME PAGE
        </a>
      </CenterDiv>
    </MainDiv>
  );
}
