export async function get_tags_by_char(
  char: string,
  min_model_count?: number,
): Promise<Set<string>> {
  const tags: Set<string> = new Set();

  const url = new URL(`https://civitai.com/api/v1/tags`);
  url.searchParams.set("limit", "200");
  url.searchParams.set("query", char);
  url.searchParams.set("page", "1");

  const temp_json = await fetch(url.toString()).then((res) => res.json());
  const totalpages = temp_json.metadata && temp_json.metadata.totalPages - 1;

  const tag_url_promises = [];

  for (let i = 1; i < totalpages; ++i) {
    url.searchParams.set("page", `${i}`);

    tag_url_promises.push(
      fetch(url.toString()).then((res) => res.json()),
    );
  }

  const json_data = await Promise.all(tag_url_promises);

  json_data.forEach((data) => {
    data.items.forEach((item) => {
      if (min_model_count && item.modelCount < min_model_count) {
        return;
      }

      tags.add(item.name);
    });
  });

  return tags;
}
