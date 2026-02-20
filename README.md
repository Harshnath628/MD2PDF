# Markdown to PDF

Convert Markdown to beautiful, print-ready PDFs in your browser. Similar to [markdowntopdf.com](https://www.markdowntopdf.com/), but 100% client-side — your content never leaves your device.

## Features

- **Live Markdown preview** — See formatted output as you type
- **Full GFM support** — Tables, code blocks, lists, bold, italic, and more
- **File upload** — Drop a `.md` file to load it
- **Sample content** — One-click load of sample Markdown (Computer Architecture notes)
- **Download PDF** — Export to a clean, properly styled PDF
- **Privacy-first** — All processing happens locally in your browser

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for production

```bash
npm run build
```

Output is in the `dist/` folder. Serve it with any static host (Netlify, Vercel, GitHub Pages, etc.).

## Tech stack

- [marked](https://marked.js.org/) — Markdown → HTML
- [html2pdf.js](https://github.com/eKoopmans/html2pdf.js) — HTML → PDF (via html2canvas + jsPDF)
- [Vite](https://vitejs.dev/) — Build tool

## License

MIT
