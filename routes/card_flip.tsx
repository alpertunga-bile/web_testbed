import { PageProps } from "$fresh/server.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";

export default function CardFlipPage(_props: PageProps) {
  return (
    <MainDiv>
      <CenterDiv>
        <div className={"card"}>
          <div className={"card-face card-face-front"}>
            <p>FRONT</p>
          </div>
          <div className={"card-face card-face-back"}>
            <p>BACK</p>
          </div>
        </div>
      </CenterDiv>
    </MainDiv>
  );
}
