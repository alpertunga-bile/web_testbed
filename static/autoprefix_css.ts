import postcss from "postcss";
import autoprefixer from "autoprefixer";
import { walk } from "@std/fs";

interface PrefixResult {
  css: string;
  is_failed: boolean;
}

async function prefixCSS(
  css: string,
  css_filepath: string,
): Promise<PrefixResult> {
  const result = await postcss([autoprefixer]).process(css, {
    from: css_filepath,
  });

  result.warnings().forEach((warning) => {
    console.warn(warning.toString());
  });

  return { css: result.css, is_failed: result.warnings().length > 0 };
}

if (import.meta.main) {
  const css_folder = "./static";

  for await (
    const css_file of walk(css_folder, {
      includeDirs: false,
      includeFiles: true,
      includeSymlinks: false,
      exts: ["css"],
      skip: [/pico.classless.conditional.fuchsia.min/],
    })
  ) {
    console.log(`Processing ${css_file.path}`);

    const css_content = await Deno.readTextFile(css_file.path);

    const { css, is_failed } = await prefixCSS(css_content, css_file.path);

    if (is_failed) {
      continue;
    }

    await Deno.writeTextFile(css_file.path, css);

    console.log(`Saved to ${css_file.path}`);
  }
}
