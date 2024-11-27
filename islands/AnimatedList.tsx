import { Ref, useRef } from "preact/hooks";
import PicoStyle from "../components/PicoStyle.tsx";
import { JSX } from "preact/jsx-runtime";

export default function AnimatedList() {
  const ul_ref: Ref<HTMLUListElement> = useRef(null);

  const button_onclick: JSX.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    const new_li_elem = globalThis.document.createElement("li");
    new_li_elem.innerHTML = "List item";
    new_li_elem.className = "animated_li";
    new_li_elem.style.backgroundColor = `rgb(${Math.random() * 255},${
      Math.random() * 255
    },${Math.random() * 255})`;

    new_li_elem.onclick = function () {
      ul_ref.current?.removeChild(new_li_elem);
    };

    ul_ref.current?.appendChild(new_li_elem);

    setTimeout(function () {
      new_li_elem.className = new_li_elem.className + " show";
    }, 10);
  };

  return (
    <PicoStyle>
      <ul ref={ul_ref} className={"slide-fade"}>
        <li
          className="animated_li show"
          onClick={(event) => ul_ref.current?.removeChild(event.currentTarget)}
        >
          List item
        </li>
      </ul>
      <button onClick={button_onclick}>Add to list</button>
    </PicoStyle>
  );
}
