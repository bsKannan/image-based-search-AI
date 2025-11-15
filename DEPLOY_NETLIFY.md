# Deploying the frontend to Netlify

This document shows a simple, reliable way to deploy the `image-search-frontend` (Vite + React + TypeScript) to Netlify.

---

## 1) Netlify repo connection (recommended)

1. Push your code to GitHub (or GitLab/Bitbucket).
2. In the Netlify app, click "New site from Git".
3. Connect your Git provider and select the repository.

Build settings (important):
- Base directory: `image-search-frontend`
- Build command: `npm ci && npm run build`
- Publish directory: `dist`

Netlify will run the build inside `image-search-frontend` and publish the contents of `dist`.

## 2) Environment variables

Your frontend should call the backend using the Vite environment variable `VITE_API_BASE`.

- In the Netlify site dashboard go to Site settings → Build & deploy → Environment → Environment variables.
- Add a variable:
  - Key: `VITE_API_BASE`
  - Value: e.g. `https://api.yourdomain.com` (your backend production URL)

Locally, you can set it in `image-search-frontend/.env` (for development):
```
VITE_API_BASE=http://localhost:5000
```

Note: Vite exposes env variables to the client only if they start with `VITE_`.

## 3) SPA routing

To ensure client-side routes work, a `_redirects` file is included under `image-search-frontend/public/_redirects` with the contents:
```
/*    /index.html   200
```
Netlify will include this during the build so direct navigation works.

## 4) Quick local test

From your repo root, install and build the frontend locally:

```bash
cd image-search-frontend
npm install
VITE_API_BASE=http://localhost:5000 npm run build
npx serve dist  # or use any static server to serve `dist`
```

## 5) Netlify CLI (optional)

You can also deploy using the Netlify CLI:

```bash
# install netlify CLI
npm install -g netlify-cli

# login
netlify login

# build
cd image-search-frontend
npm ci && npm run build

# deploy (replace SITE_ID or optionally run `netlify init` once)
netlify deploy --prod --dir=dist
```

If you plan to automate, set `VITE_API_BASE` in Netlify site environment variables or your CI.

## 6) Troubleshooting

- Build fails: check Netlify build logs. Locally run `npm ci && npm run build` inside `image-search-frontend` to reproduce errors.
- Wrong backend URL: ensure `VITE_API_BASE` is set in Netlify UI (or `netlify.toml` for non-sensitive defaults).
- Routing 404s: ensure `_redirects` exists in `public/` or configure Netlify redirects.

---

These steps should let you deploy the frontend quickly and point it at your backend using `VITE_API_BASE`.
