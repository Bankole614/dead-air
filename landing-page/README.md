# Dead Air — Portfolio Landing Page

This folder contains the marketing and portfolio showcase landing page for **Dead Air**. Tailwind CSS is compiled ahead of time; the deployed page does not load Tailwind's Play CDN or need Node.js at runtime.

## Contents

- `index.html`: Landing page markup, embedded SVG oscilloscope preview, and inline SVG favicon.
- `src/input.css`: Tailwind entry point and custom waveform animations/styles.
- `tailwind.config.js`: Tailwind theme and HTML content scan configuration.
- `styles.css`: Generated, minified stylesheet loaded by the page.
- `Dead_Air_Case_Study.pdf`: Four-page systems architecture and engineering case study PDF.

## Build

Install the build dependency and generate the production stylesheet:

```sh
npm install
npm run build
```

For local preview, open `index.html` after building or serve this folder with any static file server. Node.js is needed only to install dependencies and build, not to host the site.

## Deploy

Deploy `index.html`, `styles.css`, and `Dead_Air_Case_Study.pdf` together to any static host, including GitHub Pages, Netlify, Vercel, or Cloudflare Pages. Run `npm run build` as the host's build command when building from source; the publish directory is this folder. `vercel.json` configures Vercel to use the repository root as its output directory.

Update the `https://deadair.bankole.xyz` "Play game" links in `index.html` to point to your hosted Dead Air PWA URL.
