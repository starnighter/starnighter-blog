import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
    integrations: [vue()],
    markdown: {
        shikiConfig: {
            theme: 'one-dark-pro',
            wrap: true,
        },
    },
    vite: {
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                // 自动导入 El-Button, El-Dialog 等
                // 关键：这里需要指定 d.ts 文件的位置
                dts: 'src/components.d.ts',
                resolvers: [
                    ElementPlusResolver({
                        // 确保样式也能按需导入
                        importStyle: 'true',
                    })
                ],
            }),
        ],
    },
});