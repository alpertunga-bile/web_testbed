import { PageProps } from "$fresh/server.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";

export default function ImageCardFlipPage(_props: PageProps) {
  return (
    <MainDiv>
      <CenterDiv>
        <div className={"image-card"}>
          <div className={"image-card-face image-card-face-front"}>
            <img
              src={"https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/cc242d6c-f960-4274-aa1d-f22a71e705ef/width=832/cc242d6c-f960-4274-aa1d-f22a71e705ef.jpeg"}
              className={"object-cover"}
            >
            </img>
          </div>
          <div className={"image-card-face image-card-face-back"}>
            <img
              src={"https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/695375a4-d7af-461e-ae6f-5ee960d34caa/width=832/695375a4-d7af-461e-ae6f-5ee960d34caa.jpeg"}
              className={"object-cover"}
            >
            </img>
          </div>
        </div>
      </CenterDiv>
    </MainDiv>
  );
}
