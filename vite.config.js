import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/app/",
  plugins: [react()],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    // Configurações para otimizar arquivos grandes
    target: "es2020",
    minify: true,
  },
  build: {
    // Configurações de build para otimizar arquivos grandes
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar ícones em chunks próprios
          "fontawesome-icons": ["./src/data/fontawesome-icons.json"],
          "material-icons": ["./src/data/material-icons.json"],
        },
      },
    },
  },
  optimizeDeps: {
    // Otimizar dependências grandes
    include: ["react", "react-dom", "reactstrap"],
  },
});
