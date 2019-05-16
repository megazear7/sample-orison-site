import { html } from 'orison';

export default async (products, disabled) => html`
  ${products.map(product => html`
    <section>
      <h2>
        ${product.fields.title}
        <small>${'$' + product.fields.price}</small>
      </h2>
      <img class="mobile"
           alt="${product.fields.desktopHeroImage.fields.description}"
           src="${product.fields.desktopHeroImage.fields.file.url}?w=400">
      <p class="mobile">
        ${product.fields.description}
        <br>
        <a href="/products/${product.fields.slug}.html">Read More</a>
      </p>
      <div class="small-overview desktop-flex">
        <div>
          <img alt="${product.fields.desktopHeroImage.fields.description}"
               src="${product.fields.desktopHeroImage.fields.file.url}?w=400">
        </div>
        <p>
          ${product.fields.description}
          <br>
          <a href="/products/${product.fields.slug}.html">Read More</a>
        </p>
      </div>
      ${ ! disabled ? html`
        <div class="add-to-cart-outer">
          <div class="add-to-cart-container">
            <button class="remove-from-cart" data-slug="${product.fields.slug}">-</button>
            <div class="cart-count" data-slug="${product.fields.slug}"></div>
            <button class="add-to-cart" role="link" data-slug="${product.fields.slug}">Add to cart</button>
            <button class="add-more-to-cart" role="link" data-slug="${product.fields.slug}">+</button>
          </div>
        </div>
      ` : ''}
    </section>
  `)}
`;
