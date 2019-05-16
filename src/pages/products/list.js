import { html } from 'orison';
import client from '../../contentful.js';

function searchParams(slug, category) {
  var params = {
    'content_type': 'product',
    'fields.category': category,
    'fields.disabled[ne]': true
  };

  if (slug) params['fields.slug'] = slug;

  return params;
}

export default async (context, slug) => {
  const site = await client.getEntry(context.root.data.siteId);
  const entries = await client.getEntries(searchParams(slug, context.data.category));

  return entries.items.map(entry => ({
    name: entry.fields.slug,
    html: html`
      <section>
        <h2>${entry.fields.title}
          <small>
            ${entry.fields.inStock ? '$' + entry.fields.price : 'Out of stock'}
          </small>
        </h2>
        <div>
          <img alt="${entry.fields.desktopHeroImage.fields.description}"
               src="${entry.fields.desktopHeroImage.fields.file.url}?w=800">
        </div>
        ${context.mdString(entry.fields.content)}
        ${ ! site.fields.disabled ? html`
          <div class="add-to-cart-outer">
            <div class="add-to-cart-container">
              <button class="remove-from-cart" data-sku-id="${entry.fields.skuId}">-</button>
              <div class="cart-count" data-sku-id="${entry.fields.skuId}"></div>
              <button class="add-to-cart" role="link" data-sku-id="${entry.fields.skuId}">Add to cart</button>
              <button class="add-more-to-cart" role="link" data-sku-id="${entry.fields.skuId}">+</button>
            </div>
          </div>
        ` : '' }
        <div id="error-message"></div>
      </section>
    `
  }));
};
