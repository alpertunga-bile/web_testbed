import { Handlers, PageProps } from "$fresh/server.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";
import PicoStyle from "../components/PicoStyle.tsx";
import Trie from "../static/trie.ts";
import { get_tags_by_char } from "../static/utilities.ts";

const tag_head_chars = "abcdefghijklmnopqrstuvwxyz123456789".split("");

interface ITagSearchData {
  tag_trie: Trie;
}

export const handler: Handlers<ITagSearchData> = {
  async GET(_req, ctx) {
    const tag_promises: Promise<Set<string>>[] = [];

    tag_head_chars.forEach((char) =>
      tag_promises.push(get_tags_by_char(char, 5))
    );

    const tag_sets = await Promise.all(tag_promises);

    const tag_trie: Trie = new Trie();

    tag_sets.forEach((set_value) => tag_trie.multi_insert(set_value));

    return ctx.render({ tag_trie: tag_trie });
  },
};

export default function TagSearchPage(props: PageProps) {
  const { tag_trie } = props.data;
  const temp_list: string[] = tag_trie.starts_with("as");

  return (
    <MainDiv>
      <CenterDiv>
        <PicoStyle>
          <input
            className={"search"}
            type={"search"}
            placeholder={"Search a tag"}
            aria-label={"Search"}
          />
        </PicoStyle>
      </CenterDiv>
    </MainDiv>
  );
}
