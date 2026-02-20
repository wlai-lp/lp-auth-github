# 01-login (GitHub Pages)

This project is a static Auth0 + LivePerson demo app designed to run on GitHub Pages.

## Structure

- `index.html`: single page app shell
- `public/js/app.js`: Auth0 bootstrap and auth flow
- `public/js/ui.js`: UI updates and hash-based routing (`#/`, `#/profile`)
- `public/js/wei_auth.js`: LivePerson auth hook
- `public/auth_config.json`: Auth0 public config (`domain`, `clientId`)
- `.github/workflows/deploy-pages.yml`: automatic GitHub Pages deployment

## Local preview

From the repo root, run a static server:

```bash
python3 -m http.server 3000
```

Then open:

- `http://localhost:3000/`
- Example with LivePerson site id: `http://localhost:3000/?site=90412079`

## Auth0 setup

Update `public/auth_config.json`:

```json
{
  "domain": "YOUR_AUTH0_DOMAIN",
  "clientId": "YOUR_AUTH0_CLIENT_ID"
}
```

For Auth0 app settings, include your GitHub Pages callback/logout URLs, for example:

- `https://<user>.github.io/<repo>/`

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In GitHub repo settings, enable Pages and select **GitHub Actions** as source.
3. Push to `main`; the workflow deploys automatically.

## Notes

- Routing is hash-based, so deep links work on Pages without server rewrites.
- Asset paths are relative so this works under `/<repo>/` project pages.
