import { PageProps } from "$fresh/server.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";
import AnimatedList from "../islands/AnimatedList.tsx";

export default function AnimatedListPage(_page: PageProps) {
  return (
    <MainDiv>
      <CenterDiv>
        <AnimatedList />
      </CenterDiv>
    </MainDiv>
  );
}
