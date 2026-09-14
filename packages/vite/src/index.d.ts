import { MLTTMapping } from '@madhu-mltt/core';

export interface VitePluginOptions {
  mapping?: MLTTMapping;
  fontFamily?: string;
  include?: RegExp | string;
  exclude?: RegExp | string;
  accessible?: boolean;
}

export declare function madhuMLTTVite(options?: VitePluginOptions): any;

export default madhuMLTTVite;
