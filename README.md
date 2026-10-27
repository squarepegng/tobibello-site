# Toby Bello portfolio

A plain HTML/CSS/JS copy of the site that used to live at tobibello.framer.website.
No build step, no Framer. Everything it needs (fonts, images) is inside this folder.

## Files

- `index.html` – the homepage
- `work/<project>/index.html` – the four case studies
- `assets/styles.css` – all styling (colours and fonts are at the top)
- `assets/site.js` – menu, scroll-in animations, logo ticker, testimonial slider
- `assets/images/`, `assets/fonts/` – every image and font, saved locally

## Preview on your computer

```
cd ~/Documents/tobibello-site
python3 -m http.server 4321
```

Then open http://localhost:4321

## Put it online

Any static host works. Easiest options:

- **Vercel / Netlify:** drag this folder onto their dashboard, or push it to a GitHub repo and import it.
  Framework preset "Other", no build command, no output directory.
- **GitHub Pages:** push to a repo, then Settings → Pages → deploy from the main branch.

Then point your own domain at it from the host's settings.
