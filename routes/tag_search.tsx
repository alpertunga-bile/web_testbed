import { Handlers, PageProps } from "$fresh/server.ts";
import { exists } from "$std/fs/exists.ts";
import { get_tags_by_char } from "../static/utilities.ts";
import { decode, encode } from "cbor-x";

import { difference, format, parse } from "@std/datetime";

/*
 * ------------------------------------------------------------------------------
 * -- Components
 */
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";
import SuggestedSearchbar from "../islands/SuggestedSearchbar.tsx";

const tag_head_chars = "abcdefghijklmnopqrstuvwxyz123456789".split("");
const tags_binary_filepath = "./static/tags.bin";
const date_formating = "dd-MM-yyyy";

/*
 * ------------------------------------------------------------------------------
 * -- Interfaces
 */
interface ITagSearchData {
  tag_values: Array<Array<string>>;
}

interface ITagInfo {
  creation_time: string;
  remaining_day: number;
  tags: Array<Array<string>>;
}

/*
 * ------------------------------------------------------------------------------
 * -- Functions
 */
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
    const is_bin_exists = await exists(tags_binary_filepath);

    if (is_bin_exists) {
      const data = await Deno.readFile(tags_binary_filepath);
      const tag_info: ITagInfo = JSON.parse(decode(data));

      if (
        !check_if_cache_expired(tag_info.creation_time, tag_info.remaining_day)
      ) {
        return ctx.render({ tag_values: tag_info.tags });
      }

      await Deno.remove(tags_binary_filepath);
    }

    const tag_promises: Promise<Set<string>>[] = [];

    tag_head_chars.forEach((char) =>
      tag_promises.push(get_tags_by_char(char, 5))
    );

    const tag_sets = await Promise.all(tag_promises);

    const tag_values = tag_sets.map((value) => Array.from(value));

    await create_cache_file(tag_sets);

    return ctx.render({ tag_values: tag_values });
  },
};

export default function TagSearchPage(props: PageProps) {
  const { tag_values } = props.data;

  return (
    <MainDiv>
      <CenterDiv>
        <SuggestedSearchbar tags={tag_values} />
      </CenterDiv>
    </MainDiv>
  );
}
