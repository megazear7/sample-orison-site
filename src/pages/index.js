import { html } from 'orison';
import client from '../contentful.js';
import productList from '../partials/product-list.js';

export default async context => {
  const site = await client.getEntry(context.root.data.siteId);
  const contentfulPage = await client.getEntry(context.data.pageId);

  const entries = await client.getEntries({
    'content_type': 'product',
    'order': 'sys.createdAt',
    'fields.disabled[ne]': true
  });

  return html`
    <section>
      <h2>${contentfulPage.fields.title}</h2>
      ${context.mdString(contentfulPage.fields.content)}
      <div id="error-message"></div>
    </section>
    ${productList(entries.items, site.fields.disabled)}
  `;
};
