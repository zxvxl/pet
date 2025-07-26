import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import typescript from '@rollup/plugin-typescript';
import { viteMockServe } from 'vite-plugin-mock';
import { configHtmlPlugin } from './html';
import { configCompressPlugin } from './compress';
import { configVisualizerConfig } from './visualizer';

// Import type for Vite environment variables
interface ViteEnv {
  VITE_PUBLIC_PATH: string;
  VITE_PORT: number;
  VITE_PROXY: string;
  [key: string]: any;
}

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const plugins: PluginOption[] = [];

  // Essential Vue and TypeScript plugins
  plugins.push(vue({
    template: {
      compilerOptions: {
        // Support for custom components
        isCustomElement: (tag) => tag.startsWith('icon-')
      }
    }
  }));
  plugins.push(vueJsx());
  plugins.push(typescript({
    tsconfig: './tsconfig.json',
    target: 'ESNext',
    rootDir: process.cwd(),
    moduleResolution: 'Node',
    sourceMap: !isBuild
  }));

  // Basic plugins
  plugins.push(configHtmlPlugin(viteEnv, isBuild));

  // Development plugins
  if (!isBuild) {
    plugins.push(viteMockServe({
      mockPath: 'mock',
      localEnabled: true,
      prodEnabled: false,
    }));
  }

  // Build plugins
  if (isBuild) {
    plugins.push(configCompressPlugin(viteEnv));
    plugins.push(configVisualizerConfig());
  }

  return plugins;
}