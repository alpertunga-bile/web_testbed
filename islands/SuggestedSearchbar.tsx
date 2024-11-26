import { useEffect } from "preact/hooks";
import PicoStyle from "../components/PicoStyle.tsx";
import Trie from "../static/trie.ts";
import { useSignal } from "@preact/signals";

export default function SuggestedSearchbar(
  props: { tags: Array<Array<string>> },
) {
  const tag_obj = useSignal(new Trie());
  const suggestions: Signal<string[]> = useSignal([]);

  useEffect(() => {
    props.tags.forEach((tag) => tag_obj.value.multi_insert(tag));
  }, []);

  const searchbar_oninput = (
    event,
  ) => {
    const input_value: string = event.target.value;

    if (input_value === "") {
      suggestions.value = [];
      return;
    }

    suggestions.value = [...tag_obj.value.starts_with(input_value).slice(0, 5)];

    if (
      suggestions.value.length === 1 && suggestions.value[0] === input_value
    ) {
      suggestions.value = [];
    }
  };

  return (
    <PicoStyle>
      <input
        className={"search"}
        type={"search"}
        placeholder={"Search a tag"}
        aria-label={"Search"}
        onInput={searchbar_oninput}
      />

      <ul key="searchbar_suggestion">
        {suggestions.value.map((suggestion) => (
          <li key={`tag_${suggestion}`}>{suggestion}</li>
        ))}
      </ul>
    </PicoStyle>
  );
}
