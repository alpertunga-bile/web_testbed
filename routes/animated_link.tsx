import { PageProps } from "$fresh/server.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";

export default function AnimatedLink(_props: PageProps) {
  return (
    <MainDiv>
      <CenterDiv>
        <a href={"/buffer_loading"} className={"animated_link text-4xl"}>
          GO TO THE LOADING PAGE
        </a>
      </CenterDiv>
    </MainDiv>
  );
}
