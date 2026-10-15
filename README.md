# Belpak Packaging website

A static website: upload this folder to any web host (Vercel, Netlify, Hostinger, cPanel, GitHub Pages). No build step.

```
index.html            the whole site (pages, styles, scripts, product data)
img/p/                product photos cut from the three catalogues
img/cat/              every catalogue page, for the in-site catalogue viewer
img/hero/             editorial stills from the catalogue covers
catalogues/           the three catalogue PDFs (Get Catalog downloads these)
apps-script/Code.gs   Google Sheets lead inbox for all website forms
```

## Editing content (all inside index.html)

| What | Where |
|---|---|
| Phone, WhatsApp, email, Instagram, address, hero text | `const SITE = {…}` |
| Products: names, prices, MOQ, stock, images, variants | `const PRODUCTS = […]` |
| Catalogues: title, description, PDF file, order, on/off | `const CATALOGUES = […]` (`active: false` hides one) |
| Categories, industries, FAQs, terms, timeline | `CATS`, `INDUSTRIES`, `FAQS`, `TERMS`, `TIMELINE` |

To add a new catalogue: put the PDF in `catalogues/`, export its pages as `img/cat/<id>-01.webp`, `-02.webp`…, and add one entry to `CATALOGUES`.

## Launch checklist

1. **Connect the lead inbox (required for forms to deliver).** Follow the steps at the top of `apps-script/Code.gs`, then paste the web-app URL into `SITE.leadEndpoint`. Until this is set, every form clearly tells the visitor their details are *not sent yet* and hands them a pre-filled WhatsApp message or email instead.
2. **Domain.** Point the domain at the host. Then add `<link rel="canonical" href="https://YOUR-DOMAIN/">` and an absolute `og:image` URL in the `<head>`, and create `sitemap.xml`.
3. **Check these catalogue details with the team:**
   - Dry Fruit catalogue, page 13 lists box codes **"00"** and **"40"**; confirm the real codes.
   - Dry Fruit prices written like **"48+16"** are shown as "₹48 + ₹16" (read as box + bag) and summed for order estimates. Confirm that reading.
   - Gift hamper items **BP-GB-126, 128, 129** are marked out of stock, as in the catalogue.
   - Meena items have no MOQ in the catalogue; the site says "confirmed on inquiry".
4. **Privacy policy** is marked as a draft; have it reviewed.
5. **Optional:** add real Google Maps coordinates, a Facebook link (`belpak.packaging` appears in the gift catalogue), and genuine factory or team photos if you want them on Our Story.

## Notes

- PDFs are recompressed copies of the originals (same pages and text, 110 MB → 14.5 MB) so they download quickly and fit hosting limits. To serve the originals instead, replace the files in `catalogues/` with the same filenames.
- Product copy describes only what's visible in the catalogue photos; sizes, codes, MOQs and prices come straight from the catalogues.
- Ordering is "order request" based: the visitor picks a design, size and quantity, sees an estimate at catalogue price, and sends the order; Belpak then confirms availability, GST, freight and advance payment, as the catalogue terms require. Nothing is charged online.
