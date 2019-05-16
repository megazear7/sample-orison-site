import { html } from 'orison';

export default async (products, disabled) => html`
  ${products.map(product => html`
    <section>
      <h2>
        ${product.fields.title}
        <small>
          ${product.fields.inStock ? '$' + product.fields.price : 'Out of stock'}
        </small>
      </h2>
      <div class="small-overview">
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
            <button class="remove-from-cart" data-sku-id="${product.fields.skuId}">-</button>
            <div class="cart-count" data-sku-id="${product.fields.skuId}"></div>
            <button class="add-to-cart" role="link" data-sku-id="${product.fields.skuId}">Add to cart</button>
            <button class="add-more-to-cart" role="link" data-sku-id="${product.fields.skuId}">+</button>
          </div>
        </div>
      ` : ''}
    </section>
  `)}
`;
