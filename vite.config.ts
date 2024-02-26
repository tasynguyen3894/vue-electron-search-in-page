/// <reference types="vitest" />
// Configure Vitest (https://vitest.dev/config/)

import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue'
import commonjsExternals from 'vite-plugin-commonjs-externals';
import builtinModules from 'builtin-modules';

const commonjsPackages = [
  'electron',
  'electron/main',
  'electron/common',
  'electron/renderer',
  'original-fs',
  ...builtinModules,
];

export default defineConfig({
  build: {
    lib: {
      entry: [
        resolve(__dirname, 'src/main.ts'),
        resolve(__dirname, 'src/preload.ts'),
        resolve(__dirname, 'src/vue.ts')
      ],
      name: 'lib'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'vue'
        }
      }
    }
  },
  optimizeDeps: {
    exclude: commonjsPackages
  },
  plugins: [vue(), dts(), commonjsExternals({
    externals: commonjsPackages
  })]
});
