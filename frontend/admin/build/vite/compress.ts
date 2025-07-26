import type { PluginOption } from 'vite';
import compressPlugin from 'vite-plugin-compression';

export function configCompressPlugin(viteEnv: Record<string, any>): PluginOption | PluginOption[] {
  const { VITE_BUILD_COMPRESS = 'none', VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE = false } = viteEnv;

  const compressList = VITE_BUILD_COMPRESS.split(',');
  const plugins: PluginOption[] = [];

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        algorithm: 'gzip',
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
      })
    );
  }

  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile: VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
      })
    );
  }

  return plugins;
}