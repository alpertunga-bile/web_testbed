class TrieNode {
  constructor(is_key_node: boolean) {
    this.key_node = is_key_node;
  }

  key_node: boolean = false;
  readonly nodes: Map<string, TrieNode> = new Map<string, TrieNode>();
}

class Trie {
  constructor(values?: string[]) {
    if (!values) {
      return;
    }

    values.forEach((value) => this.insert(value));
  }

  contains(val: string): boolean {
    const chars = val.split("");
    let current_node: TrieNode | undefined = this.root;

    for (const char of chars) {
      if (!current_node) {
        return false;
      }

      if (!current_node.nodes.has(char)) {
        return false;
      }

      current_node = current_node.nodes.get(char);
    }

    return true;
  }

  insert(val: string) {
    const chars = val.split("");
    let current_node: TrieNode | undefined = this.root;

    for (const char of chars) {
      if (!current_node) {
        return;
      }

      if (current_node.nodes.has(char)) {
        current_node = current_node.nodes.get(char);
        continue;
      }

      const new_node = new TrieNode(false);
      current_node.nodes.set(char, new_node);
      current_node = current_node.nodes.get(char);
    }

    if (current_node) {
      current_node.key_node = true;
    }
  }

  readonly root: TrieNode = new TrieNode(false);
}

export const tag_trie: Trie = new Trie();
