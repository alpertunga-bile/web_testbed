import { ComponentChildren } from "preact";

export default function MainDiv(props: { children: ComponentChildren }) {
  return (
    <div className={"bg-neutral-900"}>
      {props.children}
    </div>
  );
}
