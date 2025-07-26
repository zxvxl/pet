import type { PluginOption } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export function configHtmlPlugin(viteEnv: Record<string, any>, isBuild: boolean): PluginOption {
  const { VITE_GLOB_APP_TITLE } = viteEnv;

  return createHtmlPlugin({
    minify: isBuild,
    inject: {
      data: {
        title: VITE_GLOB_APP_TITLE,
      },
    },
  });
}