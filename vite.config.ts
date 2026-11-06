import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/** Dev only: fills the <!--head--> placeholder and serves the vCard, mirroring scripts/prerender.mjs. */
function devHead(): Plugin {
  return {
    name: 'dev-head',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/prashanth-s.vcf', async (_req, res) => {
        const seo = await server.ssrLoadModule('/src/seo.ts');
        res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
        res.end(seo.renderVcard());
      });
    },
    async transformIndexHtml(html, ctx) {
      const seo = await ctx.server!.ssrLoadModule('/src/seo.ts');
      return html.replace('<!--head-->', seo.renderHead());
    },
  };
}

export default defineConfig({
  plugins: [react(), devHead()],
  // Allow sharing a local preview through an ngrok or Cloudflare tunnel.
  preview: { allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.io', '.trycloudflare.com'] },
});
