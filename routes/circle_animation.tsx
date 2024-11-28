import { PageProps } from "$fresh/server.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";

export default function CircleAnimationPage(_props: PageProps) {
  return (
    <MainDiv>
      <CenterDiv>
        <div className={"animated_circle_parent"}>
          <div className={"animated_circle"}></div>
          <div className={"animated_circle"}></div>
          <div className={"animated_circle"}></div>
          <div className={"animated_circle"}></div>
          <div className={"animated_circle"}></div>
          <div className={"animated_circle"}></div>
          <div className={"animated_circle"}></div>
          <div className={"animated_circle"}></div>
        </div>
      </CenterDiv>
    </MainDiv>
  );
}
