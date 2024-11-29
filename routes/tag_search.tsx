import { Handlers, PageProps } from "$fresh/server.ts";
import { get_tags_by_char } from "../static/utilities.ts";

import { Cacher, default_cacher_options } from "../static/cacher.ts";

/*
 * ------------------------------------------------------------------------------
 * -- Components
 */
import CenterDiv from "../components/CenterDiv.tsx";
import MainDiv from "../components/MainDiv.tsx";
import SuggestedSearchbar from "../islands/SuggestedSearchbar.tsx";

const tag_head_chars = "abcdefghijklmnopqrstuvwxyz123456789".split("");

/*
 * ------------------------------------------------------------------------------
 * -- Interfaces
 */
interface ITagSearchData {
  tag_values: Array<Array<string>>;
}

interface ITagInfo {
  tags: Array<Array<string>>;
}

/*
 * ------------------------------------------------------------------------------
 * -- Functions
 */

export const handler: Handlers<ITagSearchData> = {
  async GET(_req, ctx) {
    const cache_filename: string = "tags";
    const cacher_options = default_cacher_options;
    const cacher: Cacher = new Cacher(cacher_options);

    const is_exists = await cacher.is_cache_file_exists(cache_filename);

    if (is_exists) {
      const return_info = await cacher.get_data(cache_filename);
      const tag_info: ITagInfo = JSON.parse(return_info.data);

      if (!return_info.is_expired) {
        return ctx.render({ tag_values: tag_info.tags });
      }
    }

    const tag_promises: Promise<Set<string>>[] = [];

    tag_head_chars.forEach((char) =>
      tag_promises.push(get_tags_by_char(char, 5))
    );

    const tag_sets = await Promise.all(tag_promises);

    const tag_values = tag_sets.map((value) => Array.from(value));

    const tag_info: ITagInfo = {
      tags: tag_sets.map((set_value) => Array.from(set_value)),
    };

    await cacher.from_obj(
      tag_info,
      cache_filename,
    );

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
