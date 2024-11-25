import { Handlers, PageProps } from "$fresh/server.ts";
import { exists } from "$std/fs/exists.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";
import PicoStyle from "../components/PicoStyle.tsx";
import Trie from "../static/trie.ts";
import { get_tags_by_char } from "../static/utilities.ts";
import { decode, encode } from "cbor-x";

const tag_head_chars = "abcdefghijklmnopqrstuvwxyz123456789".split("");
const tags_binary_filepath = "./static/tags.bin";

interface ITagSearchData {
  tag_trie: Trie;
}

export const handler: Handlers<ITagSearchData> = {
  async GET(_req, ctx) {
    const tag_promises: Promise<Set<string>>[] = [];
    const tag_trie: Trie = new Trie();

    const is_bin_exists = await exists(tags_binary_filepath);

    if (is_bin_exists) {
      const data = await Deno.readFile(tags_binary_filepath);
      const json_map: Map<string, Array<string>> = new Map(
        Object.entries(JSON.parse(decode(data))),
      );

      json_map.forEach((tags) => tag_trie.multi_insert(tags));

      return ctx.render({ tag_trie: tag_trie });
    }

    tag_head_chars.forEach((char) =>
      tag_promises.push(get_tags_by_char(char, 5))
    );

    const tag_sets = await Promise.all(tag_promises);

    const tags: Map<string, Array<string>> = new Map<string, Array<string>>();

    tag_sets.forEach((set_value, index) => {
      tags.set(tag_head_chars[index], Array.from(set_value));
    });

    const tag_object = Object.fromEntries(tags);

    const json_array = new Uint8Array(encode(JSON.stringify(tag_object)));

    await Deno.writeFile(tags_binary_filepath, json_array);

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
