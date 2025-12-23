import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          injectRegister: 'auto',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg}']
          },
          includeAssets: ['favicon.svg'],
          manifest: {
            name: '物业收费实时可视化系统',
            short_name: '物业收费',
            description: '实时查看物业费收缴进度与AI分析建议',
            theme_color: '#6366f1',
            icons: [
              {
                src: 'favicon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
