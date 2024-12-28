/* tslint:disable */
/* eslint-disable */
export function get_compressed_cacher_info(options: CacherOptions, data: string): Uint8Array;
export function get_decompressed_data(info: Uint8Array): CacherReturnInfo;
export enum CacherCompression {
  InvalidUtf16 = 0,
  Base64 = 1,
  ValidUtf16 = 2,
  Uri = 3,
}
export enum CacherDateRemainingUnit {
  Milliseconds = 0,
  Seconds = 1,
  Minutes = 2,
  Hours = 3,
  Days = 4,
  Weeks = 5,
  Months = 6,
  Years = 7,
}
export class CacherOptions {
  free(): void;
  constructor();
  save_path: string;
  compression_type: CacherCompression;
  remaining_time_unit: CacherDateRemainingUnit;
  remaining_time: bigint;
}
export class CacherReturnInfo {
  free(): void;
  constructor();
  readonly data: string;
  readonly is_expired: boolean;
}
