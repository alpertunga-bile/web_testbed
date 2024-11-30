import { Cacher } from "./cacher.ts";
import { CacherCompression, CacherDateRemainingUnit } from "./cacher.ts";
import { LRUCache } from "./lru_cache.ts";
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

export class CacherManager<ContentType> {
  constructor(options: CacherManagerOptions = default_cacher_manager_options) {
    this.cacher = new Cacher({
      save_path: options.save_path,
      compression_type: options.compression_type,
      remaining_unit: options.remaining_unit,
      remaining_time: options.remaining_time,
    });

    this.file_map = new LRUCache(options.max_cache_file);

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

    if (overwrite && this.file_map.has(cache_filename)) {
      return;
    }

    this.file_map.set(filename, cache_filename);

    await this.cacher.from_str(value, cache_filename, overwrite);
  }

  private readonly get_cache_filepath: (filename: string) => string;
  private readonly get_hashed_filename: (filename: string) => string;
  private readonly file_map: LRUCache<string, string>;
  private readonly cacher: Cacher;
}
