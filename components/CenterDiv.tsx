import { ComponentChildren } from "preact";

export default function CenterDiv(props: { children: ComponentChildren }) {
  return (
    <div
      className={"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"}
    >
      {props.children}
    </div>
  );
}
