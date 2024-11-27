import { ComponentChildren } from "preact";

export default function ElemRow(props: { children: ComponentChildren }) {
  return (
    <div
      className={"flex flex-row flex-grow justify-center items-center content-center"}
    >
      {props.children}
    </div>
  );
}
