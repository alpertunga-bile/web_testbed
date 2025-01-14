import { Ref, useEffect, useRef } from "preact/hooks";
import PicoStyle from "../components/PicoStyle.tsx";
import Trie from "../static/trie.ts";
import { Signal, useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

export default function SuggestedSearchbar(
  props: { tags: Array<Array<string>> },
) {
  const searchbar_ref: Ref<HTMLInputElement> = useRef(null);

  const tag_obj = useSignal(new Trie());
  const suggestions: Signal<string[]> = useSignal([]);

  useEffect(() => {
    props.tags.forEach((tag) => tag_obj.value.multi_insert(tag));
  }, [props.tags]);

  const searchbar_oninput: JSX.InputEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const input_value: string = event.currentTarget.value;

    if (input_value === "") {
      suggestions.value = [];
      return;
    }

    suggestions.value = [...tag_obj.value.starts_with(input_value)];

    if (
      suggestions.value.length === 1 && suggestions.value[0] === input_value
    ) {
      suggestions.value = [];
    }
  };

  const suggestion_onclick: JSX.MouseEventHandler<HTMLLIElement> = (event) => {
    if (!searchbar_ref.current) {
      return;
    }

    suggestions.value = [];

    searchbar_ref.current.value = event.currentTarget.innerText;
  };

  const suggestion_keydown: JSX.KeyboardEventHandler<HTMLLIElement> = (
    event,
  ) => {
    if (!searchbar_ref.current) {
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    suggestions.value = [];

    searchbar_ref.current.value = event.currentTarget.innerText;
  };

  return (
    <PicoStyle>
      <input
        className={"search"}
        type={"search"}
        placeholder={"Search a tag"}
        aria-label={"Search"}
        onInput={searchbar_oninput}
        ref={searchbar_ref}
      />
      <ul
        className={"overflow-y-auto h-52 w-auto z-10"}
        key="tag_searchbar_suggestion"
      >
        {suggestions.value.map((suggestion) => (
          <li
            className={"hover:bg-fuchsia-700 focus:bg-fuchsia-700 rounded-md px-4 py-2"}
            key={`tag_${suggestion}`}
            onClick={suggestion_onclick}
            onKeyDown={suggestion_keydown}
            tabIndex={0}
          >
            {suggestion}
          </li>
        ))}
      </ul>
    </PicoStyle>
  );
}
