import { existsSync } from "$std/fs/exists.ts";
import { Cacher, CacherReturnInfo } from "./cacher.ts";
import { CacherCompression, CacherDateRemainingUnit } from "./cacher.ts";
import * as crypto from "jsr:@std/crypto";
import * as path from "jsr:@std/path";

export interface CacherManagerOptions {
  save_path: string;
  compression_type: CacherCompression;
  remaining_unit: CacherDateRemainingUnit;
  remaining_time: number;
  max_cache_file: number;
  hash_filename: boolean;
}

export const default_cacher_manager_options: CacherManagerOptions = {
  save_path: "./static",
  compression_type: CacherCompression.VALID_UTF16,
  remaining_unit: CacherDateRemainingUnit.DAYS,
  remaining_time: 5,
  max_cache_file: 128,
  hash_filename: true,
};

export type CacherManagerReturnInfo = CacherReturnInfo;

class CacherLRUCache extends Map<string, string> {
  constructor(max_size: number = 128) {
    super();

    this.max_size = max_size;
  }

  private update_most_recent(key: string, value: string) {
    super.delete(key);
    super.set(key, value);
  }

  private check_if_full(): string | undefined {
    if (this.size <= this.max_size) {
      return undefined;
    }

    const key = this.keys().next().value!;
    const value = this.get(key);

    this.delete(key);

    return value;
  }

  override has(key: string): boolean {
    const is_exists: boolean = super.has(key);

    if (is_exists) {
      this.update_most_recent(key, super.get(key)!);
    }

    return is_exists;
  }

  override get(key: string): string | undefined {
    if (!super.has(key)) {
      return undefined;
    }

    const value: string = super.get(key)!;
    this.update_most_recent(key, value);

    return value;
  }

  override set(key: string, value: string): this {
    this.update_most_recent(key, value);
    const removed_value: string | undefined = this.check_if_full();

    removed_value && Deno.removeSync(removed_value);

    return this;
  }

  private readonly max_size;
}

export class CacherManager {
  constructor(options: CacherManagerOptions = default_cacher_manager_options) {
    if (!existsSync(options.save_path)) {
      Deno.mkdirSync(options.save_path);
    }

    this.cacher = new Cacher({
      save_path: options.save_path,
      compression_type: options.compression_type,
      remaining_unit: options.remaining_unit,
      remaining_time: options.remaining_time,
    });

    this.file_map = new CacherLRUCache(options.max_cache_file);

    this.get_cache_filepath = (filename: string) => {
      return path.join(options.save_path, filename);
    };

    if (options.hash_filename) {
      this.get_hashed_filename = (filename: string) => {
        return Array.from(
          new Uint8Array(crypto.crypto.subtle.digestSync(
            "SHA3-256",
            new TextEncoder().encode(filename),
          )),
        ).map((data) => data.toString(16).padStart(2, "0")).join("");
      };
    } else {
      this.get_hashed_filename = (filename: string) => {
        return filename;
      };
    }
  }

  async save_from_str(
    value: string,
    filename: string,
    overwrite: boolean = true,
  ): Promise<void> {
    const cache_filename = this.get_hashed_filename(filename);

    if (!overwrite && this.file_map.has(cache_filename)) {
      return;
    }

    this.file_map.set(filename, this.get_cache_filepath(filename));

    await this.cacher.from_str(value, cache_filename, overwrite);
  }

  async save_from_obj(
    value: object,
    filename: string,
    overwrite: boolean = true,
  ) {
    const cache_filename = this.get_hashed_filename(filename);

    if (!overwrite && this.file_map.has(cache_filename)) {
      return;
    }

    this.file_map.set(filename, this.get_cache_filepath(filename));

    await this.cacher.from_obj(value, cache_filename, overwrite);
  }

  async save_from_map<K, V>(
    value: Map<K, V>,
    filename: string,
    overwrite: boolean = true,
  ) {
    const cache_filename = this.get_hashed_filename(filename);

    if (!overwrite && this.file_map.has(cache_filename)) {
      return;
    }

    this.file_map.set(filename, this.get_cache_filepath(filename));

    await this.cacher.from_map(value, cache_filename, overwrite);
  }

  async get_data(filename: string): Promise<CacherManagerReturnInfo> {
    const cache_filename = this.get_hashed_filename(filename);

    const cacher_return_info: CacherManagerReturnInfo = await this.cacher
      .get_data(
        cache_filename,
      );

    return cacher_return_info;
  }

  is_cache_exists(filename: string): boolean {
    return this.file_map.has(filename);
  }

  private readonly get_cache_filepath: (filename: string) => string;
  private readonly get_hashed_filename: (filename: string) => string;
  private readonly file_map: CacherLRUCache;
  private readonly cacher: Cacher;
}
