import type { Context } from "@netlify/edge-functions";

const PASSWORD = "ilovegarbage";

export default async (request: Request, context: Context) => {
  const auth = request.headers.get("authorization");

  if (auth) {
    const match = auth.match(/^Basic\s+(.+)$/i);
    if (match) {
      try {
        const decoded = atob(match[1]);
        const idx = decoded.indexOf(":");
        const password = idx >= 0 ? decoded.slice(idx + 1) : decoded;
        if (password === PASSWORD) {
          return;
        }
      } catch {
        // fall through to 401
      }
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Midwest Waste Strategy", charset="UTF-8"',
      "Content-Type": "text/plain; charset=UTF-8",
      "Cache-Control": "no-store",
    },
  });
};
