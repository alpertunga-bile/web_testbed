import { exists } from "$std/fs/exists.ts";
import * as path from "jsr:@std/path";
import {
  CacherOptions,
  CacherReturnInfo,
  get_compressed_cacher_info,
  get_decompressed_data,
} from "./cacher_wasm/cacher_wasm.js";

export const default_cacher_options = new CacherOptions();

export class Cacher {
  constructor(
    options: CacherOptions = default_cacher_options,
  ) {
    this.options = options;
    this.options.save_path = "static";
  }

  private async save_file(
    data_value: string,
    bin_filepath: string,
  ) {
    const encoded_data = get_compressed_cacher_info(this.options, data_value);

    await Deno.writeFile(bin_filepath, encoded_data);
  }

  private async main_from(data: string, filename: string, overwrite: boolean) {
    const bin_filepath = this.get_bin_filepath(filename);
    const is_exists = await exists(bin_filepath);

    if (!overwrite && is_exists) {
      return;
    }

    await this.save_file(data, bin_filepath);
  }

  async from_str(
    value: string,
    filename: string,
    overwrite: boolean = true,
  ): Promise<void> {
    await this.main_from(value, filename, overwrite);
  }

  async from_obj(
    value: object,
    filename: string,
    overwrite: boolean = true,
  ): Promise<void> {
    await this.main_from(JSON.stringify(value), filename, overwrite);
  }

  async from_map<K, V>(
    value: Map<K, V>,
    filename: string,
    overwrite: boolean = true,
  ): Promise<void> {
    await this.main_from(
      JSON.stringify(Object.fromEntries(value)),
      filename,
      overwrite,
    );
  }

  async get_data(filename: string): Promise<CacherReturnInfo> {
    const bin_filepath = this.get_bin_filepath(filename);
    const is_exists = await exists(bin_filepath);

    let cacher_return_info = new CacherReturnInfo();

    if (!is_exists) {
      console.error(`${bin_filepath} is not exists`);
      return cacher_return_info;
    }

    cacher_return_info = get_decompressed_data(
      await Deno.readFile(bin_filepath),
    );

    return cacher_return_info;
  }

  async is_cache_file_exists(filename: string): Promise<boolean> {
    const bin_filepath = this.get_bin_filepath(filename);

    return await exists(bin_filepath);
  }

  private get_bin_filepath(
    filename: string,
  ): string {
    const bin_filename = !filename.endsWith(".bin")
      ? filename + ".bin"
      : filename;
    const bin_filepath = path.join(this.options.save_path, bin_filename);

    return bin_filepath;
  }

  private options: CacherOptions;
}
