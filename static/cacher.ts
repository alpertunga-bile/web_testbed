import LZString from "../node_modules/lz-string/libs/lz-string.min.js";
import { decode, encode } from "cbor-x";
import { exists } from "$std/fs/exists.ts";
import * as path from "jsr:@std/path";
import { difference, format, parse } from "@std/datetime";
import { gunzip, gzip } from "jsr:@deno-library/compress";

export enum CacherCompression {
  INVALID_UTF16,
  BASE64,
  VALID_UTF16,
  URI,
  UINT8ARRAY,
}

export enum CacherDateRemainingUnit {
  MILLISECONDS,
  SECONDS,
  MINUTES,
  HOURS,
  DAYS,
  WEEKS,
  MONTHS,
  YEARS,
}

export interface CacherOptions {
  save_path: string;
  compression_type: CacherCompression;
  remaining_unit: CacherDateRemainingUnit;
  remaining_time: number;
}

export const default_cacher_options = {
  save_path: "./static",
  compression_type: CacherCompression.VALID_UTF16,
  remaining_unit: CacherDateRemainingUnit.DAYS,
  remaining_time: 5,
};

export interface CacherReturnInfo {
  is_expired: boolean;
  data: string;
}

interface CacherInfo {
  compress_type: string;
  creation_time: string;
  remaining_unit: string;
  remaining_time: number;
  data: string;
}

export class Cacher {
  constructor(
    options: CacherOptions = default_cacher_options,
  ) {
    this.options = options;
  }

  private async save_file(
    data_value: string,
    bin_filepath: string,
  ) {
    const info: CacherInfo = {
      compress_type: CacherCompression[this.options.compression_type],
      creation_time: format(
        new Date(),
        this.time_formatting,
        { timeZone: "UTC" },
      ),
      remaining_unit: CacherDateRemainingUnit[this.options.remaining_unit],
      remaining_time: this.options.remaining_time,
      data: this.compress(data_value),
    };

    const encoded_data: Uint8Array = new Uint8Array(
      encode(JSON.stringify(info)),
    );

    await Deno.writeFile(bin_filepath, gzip(encoded_data));
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

    const cacher_return_info: CacherReturnInfo = {
      is_expired: false,
      data: "",
    };

    if (!is_exists) {
      console.error(`${bin_filepath} is not exists`);
      return cacher_return_info;
    }

    const decoded_data = decode(
      gunzip(await Deno.readFile(bin_filepath)),
    );

    const data: CacherInfo = JSON.parse(decoded_data);

    cacher_return_info.is_expired = this.is_expired(
      data.remaining_time,
      data.creation_time,
      CacherDateRemainingUnit[
        data.remaining_unit as keyof typeof CacherDateRemainingUnit
      ],
    );

    cacher_return_info.data = this.decompress(data.data) || "";

    return cacher_return_info;
  }

  async is_cache_file_exists(filename: string): Promise<boolean> {
    const bin_filepath = this.get_bin_filepath(filename);

    return await exists(bin_filepath);
  }

  private compress(value: string): string {
    switch (this.options.compression_type) {
      case CacherCompression.INVALID_UTF16:
        return LZString.compress(value);
      case CacherCompression.BASE64:
        return LZString.compressToBase64(value);
      case CacherCompression.VALID_UTF16:
        return LZString.compressToUTF16(value);
      case CacherCompression.URI:
        return LZString.compressToEncodedURIComponent(value);
      case CacherCompression.UINT8ARRAY:
        return LZString.compressToUint8Array(value).toString();
    }
  }

  private decompress(value: string): string | null {
    switch (this.options.compression_type) {
      case CacherCompression.INVALID_UTF16:
        return LZString.decompress(value);
      case CacherCompression.BASE64:
        return LZString.decompressFromBase64(value);
      case CacherCompression.VALID_UTF16:
        return LZString.decompressFromUTF16(value);
      case CacherCompression.URI:
        return LZString.decompressFromEncodedURIComponent(value);
      case CacherCompression.UINT8ARRAY:
        return LZString.decompressFromUint8Array(value);
    }
  }

  private is_expired(
    remaining_time: number,
    creation_time: string,
    unit: CacherDateRemainingUnit,
  ): boolean {
    const creation_date = parse(creation_time, this.time_formatting);
    const diff_date = difference(creation_date, new Date());
    let remaining: number = 0;

    switch (unit) {
      case CacherDateRemainingUnit.MILLISECONDS:
        remaining = diff_date.milliseconds || 0;
        break;
      case CacherDateRemainingUnit.SECONDS:
        remaining = diff_date.seconds || 0;
        break;
      case CacherDateRemainingUnit.MINUTES:
        remaining = diff_date.minutes || 0;
        break;
      case CacherDateRemainingUnit.HOURS:
        remaining = diff_date.hours || 0;
        break;
      case CacherDateRemainingUnit.DAYS:
        remaining = diff_date.days || 0;
        break;
      case CacherDateRemainingUnit.WEEKS:
        remaining = diff_date.weeks || 0;
        break;
      case CacherDateRemainingUnit.MONTHS:
        remaining = diff_date.months || 0;
        break;
      case CacherDateRemainingUnit.YEARS:
        remaining = diff_date.years || 0;
        break;
    }

    return remaining >= remaining_time;
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

  private time_formatting: string = "dd-MM-yyyy HH:mm:ss.SSS";
  private options: CacherOptions;
}
