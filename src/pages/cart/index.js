import { html } from 'orison';
import client from '../../contentful.js';

export default async context => {
  const entry = await client.getEntry(context.data.pageId);

  return html`
    <section>
      <h2>${entry.fields.title}</h2>
      ${context.mdString(entry.fields.body)}

      <div>
        <div class="cart-preview"></div>
        <button class="checkout">Checkout</button>
      </div>
    </section>
  `;
};
