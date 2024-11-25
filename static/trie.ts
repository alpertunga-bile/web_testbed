class TrieNode {
  constructor(is_key_node: boolean) {
    this.key_node = is_key_node;
  }

  contains(char: string): boolean {
    return this.nodes.has(char);
  }

  get(char: string): TrieNode | undefined {
    return this.nodes.get(char);
  }

  key_node: boolean = false;
  readonly nodes: Map<string, TrieNode> = new Map<string, TrieNode>();
}

class Trie {
  constructor(values?: Iterable<string>) {
    if (!values) {
      return;
    }

    this.multi_insert(values);
  }

  contains(val: string): boolean {
    const chars = val.split("");
    let current_node: TrieNode | undefined = this.root;

    for (const char of chars) {
      if (!current_node) {
        return false;
      }

      if (!current_node.contains(char)) {
        return false;
      }

      current_node = current_node.nodes.get(char);
    }

    return true;
  }

  multi_insert(values: Iterable<string>) {
    for (const value of values) {
      this.insert(value);
    }
  }

  insert(val: string) {
    const chars = val.split("");
    let current_node: TrieNode | undefined = this.root;

    for (const char of chars) {
      if (!current_node) {
        return;
      }

      if (current_node.nodes.has(char)) {
        current_node = current_node.get(char);
        continue;
      }

      const new_node = new TrieNode(false);
      current_node.nodes.set(char, new_node);
      current_node = current_node.get(char);
    }

    if (current_node) {
      current_node.key_node = true;
    }
  }

  private get_last_node(value: string): TrieNode | undefined {
    let current_node: TrieNode | undefined = this.root;
    const chars = value.split("");

    for (const char of chars) {
      if (!current_node) {
        return undefined;
      }

      if (!current_node.contains(char)) {
        return undefined;
      }

      current_node = current_node.get(char);
    }

    return current_node;
  }

  private inner_starts_with(
    node: TrieNode | undefined,
    prefix: string,
  ): string[] {
    if (!node) {
      return [];
    }

    const keys = [];

    if (node.key_node) {
      keys.push(prefix);
    }

    node.nodes.forEach((value_node, key_char) => {
      keys.push(
        ...this.inner_starts_with(
          value_node,
          prefix + key_char,
        ),
      );
    });

    return keys;
  }

  starts_with(prefix: string): string[] {
    const last_node: TrieNode | undefined = this.get_last_node(prefix);

    if (!last_node) {
      return [];
    }

    return this.inner_starts_with(last_node, prefix);
  }

  readonly root: TrieNode = new TrieNode(false);
}

export default Trie;
