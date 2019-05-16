import { html } from 'orison';
import client from '../../contentful.js';

function searchParams(slug) {
  var params = {
    'content_type': 'blogPost'
  };

  if (slug) params['fields.slug'] = slug;

  return params;
}

export default async (context, slug) => {
  const entries = await client.getEntries(searchParams(slug));

  return entries.items.map(entry => ({
    name: entry.fields.slug,
    html: html`
      <section>
        <h2>${entry.fields.title}</h2>
        <div>
          <img alt="${entry.fields.desktopHeroImage.fields.description}"
               src="${entry.fields.desktopHeroImage.fields.file.url}?w=800">
        </div>
        ${context.mdString(entry.fields.body)}
      </section>
    `
  }));
};
