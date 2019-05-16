import { html } from 'orison';

export default async context => {
  return html`
    <section>
      <div>
        <div class="address-input">
          <label for="shippingName">Name</label>
          <input type="text" name="shippingName"></input>
        </div>

        <div class="address-input">
          <label for="shippingAddress">Address</label>
          <input type="text" name="shippingAddress"></input>
        </div>

        <div class="address-input">
          <label for="shippingAddressZip">Zip</label>
          <input type="text" name="shippingAddressZip"></input>
        </div>

        <div class="address-input">
          <label for="shippingAddressState">State</label>
          <input type="text" name="shippingAddressState"></input>
        </div>

        <div class="address-input">
          <label for="shippingAddressCity">City</label>
          <input type="text" name="shippingAddressCity"></input>
        </div>

        <div class="address-input">
          <label for="shippingCountry">Country</label>
          <input type="text" name="shippingCountry"></input>
        </div>

        <div class="cart-preview"></div>
        <button class="checkout" disabled>Checkout</button>
      </div>
    </section>
  `;
};
