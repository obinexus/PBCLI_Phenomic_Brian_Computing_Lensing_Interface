// File: core/avl_trie/phenomenological_trie_node.ts

import { AuraSeal } from '@/core/validation/aura_seal';

/**
 * Phenomenological Token Type definitions for GosiLang compatibility
 */
export enum PhenomenologicalTokenType {
  CONSCIOUSNESS_STATE = 'ψ_state',
  TEMPORAL_MARKER = 'τ_mark',
  SPATIAL_COORDINATE = 'σ_coord',
  QUANTUM_ENTANGLEMENT = 'θ_entangle',
  NEGATIVE_ENERGY = 'η_negative',
  POSITIVE_ENERGY = 'π_positive'
}

/**
 * County-level schema for OBINexus organization
 */
export interface CountySchema {
  department: string;
  division: string;
  county: string;
  org: string;
  
  toFQDN(): string {
    return `${this.county}.${this.division}.${this.department}.obinexus.org`;
  }
}

/**
 * AVL-balanced Trie Node for phenomenological tokenization
 * Supports infinite character range including negative integers
 */
export class AVLTrieNode<T = any> {
  // Core trie properties
  children: Map<number, AVLTrieNode<T>>; // Supports negative char codes
  value?: T;
  isEndOfToken: boolean;
  
  // AVL balancing properties
  height: number;
  balance: number;
  
  // Phenomenological properties
  phenomenologicalType?: PhenomenologicalTokenType;
  auraSeal?: AuraSeal;
  countySchema?: CountySchema;
  lastAccessed: number;
  frequency: number;
  weight: number;
  
  // Space-time optimization metrics
  spaceComplexity: number; // 0 to 1
  timeComplexity: number;  // 0 to 1
  
  constructor() {
    this.children = new Map<number, AVLTrieNode<T>>();
    this.isEndOfToken = false;
    this.height = 1;
    this.balance = 0;
    this.lastAccessed = Date.now();
    this.frequency = 0;
    this.weight = 0;
    this.spaceComplexity = 0;
    this.timeComplexity = 0;
  }
  
  /**
   * Get phenomenological score (0 to 1)
   */
  getPhenomenologicalScore(): number {
    const factors = {
      frequency: Math.min(this.frequency / 100, 1) * 0.3,
      weight: Math.min(this.weight, 1) * 0.3,
      recency: Math.min((Date.now() - this.lastAccessed) / 86400000, 1) * 0.2,
      complexity: (1 - (this.spaceComplexity + this.timeComplexity) / 2) * 0.2
    };
    
    return Object.values(factors).reduce((sum, val) => sum + val, 0);
  }
}

/**
 * AVL Trie implementation with phenomenological tokenization
 */
export class PhenomenologicalAVLTrie<T = any> {
  private root: AVLTrieNode<T>;
  private countyCache: Map<string, AVLTrieNode<T>>;
  private phenomenologicalConsistency: Map<string, AuraSeal>;
  
  constructor() {
    this.root = new AVLTrieNode<T>();
    this.countyCache = new Map();
    this.phenomenologicalConsistency = new Map();
  }
  
  /**
   * Insert token with AVL balancing and phenomenological tracking
   */
  insert(
    token: string | number[],
    value: T,
    type?: PhenomenologicalTokenType,
    countySchema?: CountySchema
  ): void {
    const chars = this.tokenToCharCodes(token);
    this.root = this.insertRecursive(this.root, chars, 0, value, type, countySchema);
  }
  
  private insertRecursive(
    node: AVLTrieNode<T>,
    chars: number[],
    index: number,
    value: T,
    type?: PhenomenologicalTokenType,
    countySchema?: CountySchema
  ): AVLTrieNode<T> {
    // Base case: end of token
    if (index === chars.length) {
      node.isEndOfToken = true;
      node.value = value;
      node.phenomenologicalType = type;
      node.countySchema = countySchema;
      node.frequency++;
      node.lastAccessed = Date.now();
      
      // Cache by county if applicable
      if (countySchema) {
        const fqdn = countySchema.toFQDN();
        this.countyCache.set(fqdn, node);
      }
      
      return node;
    }
    
    const char = chars[index];
    
    // Create child if doesn't exist
    if (!node.children.has(char)) {
      node.children.set(char, new AVLTrieNode<T>());
    }
    
    // Recursive insert
    const child = node.children.get(char)!;
    node.children.set(
      char,
      this.insertRecursive(child, chars, index + 1, value, type, countySchema)
    );
    
    // Update height and balance
    this.updateHeight(node);
    return this.balance(node, char);
  }
  
  /**
   * AVL rotation operations
   */
  private rotateRight(node: AVLTrieNode<T>, pivotChar: number): AVLTrieNode<T> {
    const leftChild = node.children.get(pivotChar)!;
    const temp = new AVLTrieNode<T>();
    
    // Copy node properties to temp
    Object.assign(temp, node);
    temp.children = new Map(node.children);
    
    // Perform rotation
    node.children = new Map(leftChild.children);
    Object.assign(node, leftChild);
    
    temp.children.delete(pivotChar);
    node.children.set(pivotChar, temp);
    
    // Update heights
    this.updateHeight(temp);
    this.updateHeight(node);
    
    return node;
  }
  
  private rotateLeft(node: AVLTrieNode<T>, pivotChar: number): AVLTrieNode<T> {
    // Similar to rotateRight but mirrored
    const rightChild = node.children.get(pivotChar)!;
    const temp = new AVLTrieNode<T>();
    
    Object.assign(temp, node);
    temp.children = new Map(node.children);
    
    node.children = new Map(rightChild.children);
    Object.assign(node, rightChild);
    
    temp.children.delete(pivotChar);
    node.children.set(pivotChar, temp);
    
    this.updateHeight(temp);
    this.updateHeight(node);
    
    return node;
  }
  
  private balance(node: AVLTrieNode<T>, char: number): AVLTrieNode<T> {
    const balanceFactor = this.getBalance(node);
    
    // Left-heavy
    if (balanceFactor > 1) {
      const leftChild = node.children.get(char);
      if (leftChild && this.getBalance(leftChild) < 0) {
        node.children.set(char, this.rotateLeft(leftChild, char));
      }
      return this.rotateRight(node, char);
    }
    
    // Right-heavy
    if (balanceFactor < -1) {
      const rightChild = node.children.get(char);
      if (rightChild && this.getBalance(rightChild) > 0) {
        node.children.set(char, this.rotateRight(rightChild, char));
      }
      return this.rotateLeft(node, char);
    }
    
    return node;
  }
  
  /**
   * Convert token to character codes supporting full Unicode and negative values
   */
  private tokenToCharCodes(token: string | number[]): number[] {
    if (Array.isArray(token)) {
      return token; // Already in number format
    }
    
    // Convert string to array of char codes
    const codes: number[] = [];
    for (let i = 0; i < token.length; i++) {
      codes.push(token.charCodeAt(i));
    }
    return codes;
  }
  
  /**
   * Search with phenomenological scoring
   */
  search(token: string | number[]): {
    value: T | null;
    score: number;
    node: AVLTrieNode<T> | null;
  } {
    const chars = this.tokenToCharCodes(token);
    let current = this.root;
    
    for (const char of chars) {
      if (!current.children.has(char)) {
        return { value: null, score: 0, node: null };
      }
      current = current.children.get(char)!;
      current.lastAccessed = Date.now();
    }
    
    if (current.isEndOfToken) {
      return {
        value: current.value!,
        score: current.getPhenomenologicalScore(),
        node: current
      };
    }
    
    return { value: null, score: 0, node: null };
  }
  
  /**
   * County-based pruning with phenomenological consistency
   */
  async pruneByCounty(
    countySchema: CountySchema,
    threshold: number = 0.5
  ): Promise<void> {
    const fqdn = countySchema.toFQDN();
    const countyNodes = this.getCountyNodes(fqdn);
    
    // Hold phenomenological consistency until disk write
    const auraSeal = new AuraSeal();
    this.phenomenologicalConsistency.set(fqdn, auraSeal);
    
    // Perform pruning
    for (const node of countyNodes) {
      if (node.getPhenomenologicalScore() < threshold) {
        await this.evictNode(node);
      }
    }
    
    // Flash to disk and release consistency
    await this.flushToDisk(fqdn);
    this.phenomenologicalConsistency.delete(fqdn);
  }
  
  private getCountyNodes(fqdn: string): AVLTrieNode<T>[] {
    const nodes: AVLTrieNode<T>[] = [];
    
    // Traverse and collect nodes matching county
    const traverse = (node: AVLTrieNode<T>) => {
      if (node.countySchema?.toFQDN() === fqdn) {
        nodes.push(node);
      }
      
      for (const child of node.children.values()) {
        traverse(child);
      }
    };
    
    traverse(this.root);
    return nodes;
  }
  
  private async evictNode(node: AVLTrieNode<T>): Promise<void> {
    // Simulate cache eviction
    node.value = undefined;
    node.isEndOfToken = false;
    node.frequency = 0;
    node.weight = 0;
  }
  
  private async flushToDisk(fqdn: string): Promise<void> {
    // Simulate disk write
    console.log(`Flushing phenomenological state for ${fqdn} to disk`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  /**
   * Get height and balance helpers
   */
  private getHeight(node: AVLTrieNode<T> | null): number {
    return node ? node.height : 0;
  }
  
  private updateHeight(node: AVLTrieNode<T>): void {
    const heights = Array.from(node.children.values()).map(child => this.getHeight(child));
    node.height = Math.max(...heights, 0) + 1;
  }
  
  private getBalance(node: AVLTrieNode<T>): number {
    if (node.children.size === 0) return 0;
    
    const heights = Array.from(node.children.values()).map(child => this.getHeight(child));
    const maxHeight = Math.max(...heights, 0);
    const minHeight = Math.min(...heights, 0);
    
    return maxHeight - minHeight;
  }
}
