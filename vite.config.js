import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      input: {
        // 每新增一个页面，在此添加入口
        index: resolve(__dirname, 'src/pages/index.html'),
            'surprise-preview': resolve(__dirname, 'src/pages/surprise-preview.html'),
      },
    },
  },
  server: {
    open: '/src/pages/index.html',
  },
})
