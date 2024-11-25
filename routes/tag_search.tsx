import { Handlers, PageProps } from "$fresh/server.ts";
import Trie from "../static/trie.ts";
import { get_tags_by_char } from "../static/utilities.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const a_tags: Set<string> = await get_tags_by_char("a");
    const tag_trie: Trie = new Trie(a_tags);

    if (tag_trie.contains("as")) {
      const vars = tag_trie.starts_with("as");
      console.log(vars);
    }

    return ctx.render();
  },
};

export default function TagSearchPage(props: PageProps) {
  return <p>Hello World</p>;
}
