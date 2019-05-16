import { html } from 'orison';
import client from '../../../contentful.js';

function searchParams(slug) {
  var params = {
    'content_type': 'product',
    'fields.disabled[ne]': true
  };

  if (slug) params['fields.slug'] = slug;

  return params;
}

export default async (context, slug) => {
  const site = await client.getEntry(context.root.data.siteId);
  const entries = await client.getEntries(searchParams(slug));

  return entries.items.map(entry => ({
    name: entry.fields.slug,
    html: html`
      <h5>
        <a href="${'/products/' + entry.fields.slug + '.html'}">${entry.fields.title}</a>
        <small>
          $${entry.fields.price}
        </small>
      </h5>
      <img alt="${entry.fields.desktopHeroImage.fields.description}"
           src="${entry.fields.desktopHeroImage.fields.file.url}?w=100&h=100&fit=thumb">
      <div class="add-to-cart-outer">
        <div class="add-to-cart-container add-to-cart-container-preview">
          <button class="remove-from-cart" data-slug="${entry.fields.slug}">-</button>
          <div class="cart-count" data-slug="${entry.fields.slug}"></div>
          <button class="add-to-cart" role="link" data-slug="${entry.fields.slug}">Add to cart</button>
          <button class="add-more-to-cart" role="link" data-slug="${entry.fields.slug}">+</button>
        </div>
      </div>
    `
  }));
};
