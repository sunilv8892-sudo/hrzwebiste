# HRz Pitstop

This project must be served over HTTP. Opening `index.html` directly with `file://` can block the JSON fetches and leave the app without its full dataset.

Run it with one of these commands from the project root:

- `npx serve .`
- `python -m http.server 8000`
- VS Code Live Server

Then open the local URL the server prints, such as `http://localhost:3000` or `http://localhost:8000`.