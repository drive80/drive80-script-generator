
# Drive80 Script Generator

A minimal Next.js app that generates two explainer scripts (~60s and ~30s) from a website or pasted text.

## Local Dev

```bash
npm i
npm run dev
```

Visit http://localhost:3000

## Deploy to Vercel (Free)

1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com → New Project → Import your repo.
3. Framework: Next.js (auto-detected). Build command: `next build`. Output: `.vercel/output` (auto).
4. Deploy. Your app will be live at `https://<your-vercel-project>.vercel.app`.

## Embed in Divi

Use a Code Module with an iframe:

```html
<iframe src="https://<your-vercel-project>.vercel.app" width="100%" height="1100" style="border:none;"></iframe>
```

Adjust height as needed.

## Optional: Subdomain

Create a CNAME like `scripts.drive80.com` → `<your-vercel-project>.vercel.app` in your DNS. Add the domain in Vercel → Project Settings → Domains.
