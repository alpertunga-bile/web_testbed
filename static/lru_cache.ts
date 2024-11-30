export class LRUCache<K, V> extends Map<K, V> {
  constructor(max_size: number = 128) {
    super();
    this.max_size = max_size;
  }

  private update_most_recent(key: K, value: V) {
    super.delete(key);
    super.set(key, value);
  }

  private check_max_size() {
    if (this.size <= this.max_size) {
      return;
    }

    this.delete(this.keys().next().value!);
  }

  override has(key: K): boolean {
    const is_exists: boolean = super.has(key);

    if (is_exists) {
      this.update_most_recent(key, super.get(key)!);
    }

    return is_exists;
  }

  override get(key: K): V | undefined {
    if (!super.has(key)) {
      return undefined;
    }

    const value: V = super.get(key)!;
    this.update_most_recent(key, value);

    return value;
  }

  override set(key: K, value: V): this {
    this.update_most_recent(key, value);
    this.check_max_size();

    return this;
  }

  private readonly max_size: number;
}
