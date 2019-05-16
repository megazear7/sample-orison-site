import { html } from 'orison';
import header from '../partials/header.js';
import nav from '../partials/nav.js';
import footer from '../partials/footer.js';
import client from '../contentful.js';

export default async context => {
  const site = await client.getEntry(context.root.data.siteId);
  const desktopImage = site.fields.desktopHeroImage ? site.fields.desktopHeroImage.fields.file.url : '';
  const mobileImage = site.fields.mobileHeroImage ? site.fields.mobileHeroImage.fields.file.url : '';

  return html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>${site.fields.title}</title>
      <script src="/app.js" type="module"></script>
      <link rel="stylesheet" type="text/css" href="/app.css">

      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="${context.root.data.description}">
      <link rel="icon" href="/icons/favicon.ico">
      <link rel="manifest" href="/manifest.json">
      <meta name="theme-color" content="${context.root.data.primaryColor}">

      <!-- Add to homescreen for Chrome on Android. Fallback for manifest.json -->
      <meta name="mobile-web-app-capable" content="yes">
      <meta name="application-name" content="${site.fields.title}">

      <!-- Add to homescreen for Safari on iOS -->
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="apple-mobile-web-app-status-bar-style" content="default">
      <meta name="apple-mobile-web-app-title" content="${site.fields.title}">

      <!-- Homescreen icons -->
      <link rel="apple-touch-icon" href="icons/icon-256x256.png">
      <link rel="apple-touch-icon" sizes="512x512" href="icons/icon-512x512.png">

      <!-- Tile icon for Windows 8 (144x144 + tile color) -->
      <meta name="msapplication-TileImage" content="icons/icon-512x512.png">
      <meta name="msapplication-TileColor" content="${context.root.data.primaryColor}">
      <meta name="msapplication-tap-highlight" content="no">

      <!-- Default twitter cards -->
      <meta name="twitter:card" content="summary">
      <meta name="twitter:site" content="@username">
      <meta property="og:type" content="website">
      <meta property="og:site_name" content="gta">
      <meta property="og:image" content="icons/icon-512x512.png" />
    </head>
    <body>
      <div class="header-container">
        ${desktopImage ? html`<img class="desktop" src="${desktopImage}">` : ''}
        ${mobileImage ? html`<img class="mobile" src="${mobileImage}">` : ''}
        ${header(site.fields.title, site.fields.disabled)}
        ${nav(context.path, context.root)}
      </div>
      <main>
        ${context.page.html}
      </main>
      ${footer()}
    </body>
  </html>
  `;
};
