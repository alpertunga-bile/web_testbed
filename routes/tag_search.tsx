import { Handlers, PageProps } from "$fresh/server.ts";
import { exists } from "$std/fs/exists.ts";
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";
import PicoStyle from "../components/PicoStyle.tsx";
import Trie from "../static/trie.ts";
import { get_tags_by_char } from "../static/utilities.ts";
import { decode, encode } from "cbor-x";

import { difference, format, parse } from "@std/datetime";

const tag_head_chars = "abcdefghijklmnopqrstuvwxyz123456789".split("");
const tags_binary_filepath = "./static/tags.bin";
const date_formating = "dd-MM-yyyy";

interface ITagSearchData {
  tag_trie: Trie;
}

interface ITagInfo {
  creation_time: string;
  remaining_day: number;
  tags: Array<Array<string>>;
}

async function create_cache_file(tag_sets: Set<string>[]) {
  const tag_info: ITagInfo = {
    creation_time: format(new Date(), date_formating),
    remaining_day: 5,
    tags: [],
  };

  tag_info.tags = tag_sets.map((set_value) => Array.from(set_value));

  const json_array = new Uint8Array(encode(JSON.stringify(tag_info)));

  await Deno.writeFile(tags_binary_filepath, json_array);
}

function check_if_cache_expired(
  created_time: string | undefined,
  expire_day: number = 5,
): boolean {
  if (!created_time) {
    return false;
  }

  const created_time_date = parse(created_time, date_formating);
  const current_time_date = new Date();

  const day_between = difference(created_time_date, current_time_date).days ||
    0;

  return day_between >= expire_day;
}

export const handler: Handlers<ITagSearchData> = {
  async GET(_req, ctx) {
    const tag_trie: Trie = new Trie();

    const is_bin_exists = await exists(tags_binary_filepath);

    if (is_bin_exists) {
      const data = await Deno.readFile(tags_binary_filepath);
      const tag_info: ITagInfo = JSON.parse(decode(data));

      if (
        !check_if_cache_expired(tag_info.creation_time, tag_info.remaining_day)
      ) {
        tag_info.tags.forEach((tags) => tag_trie.multi_insert(tags));

        return ctx.render({ tag_trie: tag_trie });
      }

      await Deno.remove(tags_binary_filepath);
    }

    const tag_promises: Promise<Set<string>>[] = [];

    tag_head_chars.forEach((char) =>
      tag_promises.push(get_tags_by_char(char, 5))
    );

    const tag_sets = await Promise.all(tag_promises);

    tag_sets.forEach((set_value) => tag_trie.multi_insert(set_value));

    await create_cache_file(tag_sets);

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
