import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, loadEnv, type Plugin } from 'vite';
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

function localReviewsApi(): Plugin {
  const routes = new Map([
    ['/api/reviews', '/api/reviews.ts'],
    ['/api/admin/reviews', '/api/admin/reviews.ts'],
  ]);
  return {
    name: 'local-reviews-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const path = `/api${(req.url ?? '/').split('?')[0]}`;
        const modulePath = routes.get(path);
        if (!modulePath) return next();

        try {
          const route = await server.ssrLoadModule(modulePath);
          await route.default(req as IncomingMessage & { body?: unknown }, res as ServerResponse);
        } catch (error) {
          if (error instanceof Error) server.ssrFixStacktrace(error);
          console.error('Local reviews API error:', error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: 'The request could not be completed. Please try again later.' }));
          }
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  for (const key of ['MONGODB_URI', 'MONGODB_DB', 'REVIEWS_ADMIN_PASSWORD']) {
    if (!process.env[key] && env[key]) process.env[key] = env[key];
  }

  return {
    plugins: [react(), devHead(), localReviewsApi()],
    // Allow sharing a local preview through an ngrok or Cloudflare tunnel.
    preview: { allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.io', '.trycloudflare.com'] },
  };
});
