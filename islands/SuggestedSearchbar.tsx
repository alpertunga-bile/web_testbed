import { Ref, useEffect, useRef } from "preact/hooks";
import PicoStyle from "../components/PicoStyle.tsx";
import Trie from "../static/trie.ts";
import { useSignal } from "@preact/signals";

export default function SuggestedSearchbar(
  props: { tags: Array<Array<string>> },
) {
  const suggestion_ref: Ref<HTMLUListElement> = useRef(null);
  const tag_obj = useSignal(new Trie());

  useEffect(() => {
    props.tags.forEach((tag) => tag_obj.value.multi_insert(tag));
  });

  const searchbar_oninput = (
    event,
  ) => {
    const input_value: string = event.target.value;

    if (input_value === "") {
      return;
    }

    const children_count = suggestion_ref.current?.children.length || 0;

    for (let i = 0; i < children_count; ++i) {
      suggestion_ref.current?.removeChild(
        suggestion_ref.current.children[i],
      );
    }

    const suggestions = tag_obj.value.starts_with(input_value).slice(0, 10);

    console.log(suggestions);

    suggestions.forEach((suggestion) => {
      const li_elem = new HTMLLIElement();
      li_elem.innerText = suggestion;

      suggestion_ref.current?.appendChild<HTMLLIElement>(li_elem);
    });
  };

  return (
    <PicoStyle>
      <input
        className={"search"}
        type={"search"}
        placeholder={"Search a tag"}
        aria-label={"Search"}
        value=""
        onInput={searchbar_oninput}
      />
      <ul ref={suggestion_ref}></ul>
    </PicoStyle>
  );
}
