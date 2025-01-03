import { PageProps } from "$fresh/server.ts";
import { Fragment, JSX } from "preact/jsx-runtime";
import CenterDiv from "../components/CenterDiv.tsx";
import ElemRow from "../components/ElemRow.tsx";
import MainDiv from "../components/MainDiv.tsx";

function LoadingObject(): JSX.Element {
  return (
    <Fragment>
      <svg
        width="100%"
        height="100%"
        x="0px"
        y="0px"
        viewBox="0 0 313.3 321.4"
        style="enable-background:new 0 0 313.3 321.4;"
        xml:space="preserve"
      >
        <path
          className="layer layer1"
          d="M157.1,0c3.8,0,7.9,1.5,11.4,3.2c45.6,21.1,91.2,42.4,136.7,63.8c3.3,1.5,8,2.1,8.1,7c0.1,5-4.7,5.6-7.9,7.1
c-45.8,21.5-91.7,42.9-137.6,64.3c-7.4,3.4-14.8,3.5-22.2,0C99,123.6,52.3,101.9,5.8,80c-2.4-1.1-5.4-4-5.4-6c0-2,3.1-4.8,5.5-5.9
C52.4,46.2,99.1,24.4,145.8,2.8C149.1,1.2,154.5,0,157.1,0z"
        />
        <path
          className="layer layer2"
          d="M156.6,235c-3.1,0-7.7-1.7-11.3-3.3c-46.5-21.6-93-43.3-139.4-65.1c-2.4-1.1-5.8-4.1-5.6-5.8c0.3-2.4,3.2-5,5.7-6.3
c7.5-4,15.3-7.3,23-10.9c7.9-3.7,15.7-3.6,23.6,0.1c30.4,14.3,61,28.4,91.4,42.7c8.6,4.1,16.8,4,25.4-0.1
c30.4-14.3,60.9-28.4,91.4-42.7c7.7-3.6,15.4-3.7,23.1-0.1c8.2,3.8,16.4,7.4,24.4,11.5c2.1,1.1,4.9,3.7,4.7,5.4
c-0.2,2.1-2.7,4.8-4.9,5.9c-46.8,22.1-93.7,44-140.7,65.8C164.2,233.5,159.9,235,156.6,235z"
        />
        <path
          className="layer layer3"
          d="M156.8,321.4c-4.6,0-9.3-2.3-13.4-4.2c-45.2-20.9-90.3-42-135.4-63.1c-3.3-1.5-8-2.1-8-7.1c0-5,3.8-5.5,7-7.1
c13.9-6.5,14.9-6.5,21.8-9.8c8-3.8,16-3.7,24.1,0.1c29.9,14,59.8,27.7,89.6,41.9c9.6,4.6,18.5,4.7,28.2,0.1 c29.8-14.2,59.8-27.9,89.6-41.9c8.2-3.9,16.3-4,24.5,0c7.8,3.8,15.8,7.2,23.5,11.1c2.1,1.1,4.8,3.3,4.8,5.4
c-0.1,2.4-2.7,4.8-4.9,5.9c-32.2,15.3-64.5,30.3-96.8,45.4c-13.9,6.5-27.7,13.1-41.7,19.3C165.7,319.2,161.5,321.4,156.8,321.4z"
        />
      </svg>
    </Fragment>
  );
}

export default function BufferLoadingPage(_props: PageProps) {
  return (
    <MainDiv>
      <CenterDiv>
        <ElemRow>
          <LoadingObject />
          <div className={"px-2"}></div>
          <h2 className={"text-center text-8xl layer layer3"}>Load</h2>
          <h2 className={"text-center text-8xl layer layer2"}>ing</h2>
          <h2 className={"text-center text-8xl layer layer1"}>...</h2>
        </ElemRow>
      </CenterDiv>
    </MainDiv>
  );
}
