import { ComponentChildren } from "preact";

export default function ElemRow(props: { children: ComponentChildren }) {
  return (
    <div className={"flex flex-row flex-grow justify-evenly gap-2.5"}>
      {props.children}
    </div>
  );
}
