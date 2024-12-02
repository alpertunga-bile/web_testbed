import { PageProps } from "$fresh/server.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";
import AnimatedBorder from "../islands/AnimatedBorder.tsx";

export default function AnimatedBorderPage(_props: PageProps) {
  return (
    <MainDiv>
      <CenterDiv>
        <AnimatedBorder />
      </CenterDiv>
    </MainDiv>
  );
}
