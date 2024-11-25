import { ComponentChildren } from "preact";

export default function PicoStyle(props: { children: ComponentChildren }) {
  return (
    <div className={"pico"}>
      {props.children}
    </div>
  );
}
