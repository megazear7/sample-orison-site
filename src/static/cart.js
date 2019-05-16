export default class Cart {
  constructor({
    id = 'cart'
  } = { }) {
    this.id = id;

    try {
      this.cart = JSON.parse(localStorage.getItem(this.id)) || { };
    } catch {
      console.error('Error initializing cart', e);
      this.cart = { }
    }
  }

  init() {
    this.cartElement.innerText = `Cart (${this.count})`;
    if (this.cartPreviewElement) {
      this.cartPreviewElement.innerHTML = '';
      this.cartPreviewElement.appendChild(this.cartPreview);
    }

    this.validations = {
      shippingName: false,
      shippingAddress: false,
      shippingAddressZip: false,
      shippingAddressState: false,
      shippingAddressCity: false,
      shippingCountry: false,
    };

    this.stripe = Stripe(this.stripePublicKey);
    this.initSkuCounts();
    this.setListeners();
  }

  initSkuCounts() {
    this.cartCountElements.forEach(div => {
      const skuId = div.dataset.skuId;
      const skuCount = this.cart[skuId];
      if (skuCount >= 1) {
        div.innerText = skuCount;
        div.parentElement.classList.add('added-to-cart');
        document.querySelector('.cart').classList.add('has-items');
      } else {
        div.parentElement.classList.remove('added-to-cart');
      }
    });
  }

  setListeners(scope = document.body) {
    this.removeFromCartElements(scope).forEach(button =>
      button.addEventListener('click', () =>
        this.removeFromCart(button)));

    this.addToCartElements(scope).forEach(button =>
      button.addEventListener('click', () =>
        this.addToCart(button)));

    this.addMoreToCartElements(scope).forEach(button =>
      button.addEventListener('click', () =>
        this.addToCart(button)));

    this.checkoutElements(scope).forEach(button =>
      button.addEventListener('click', e =>
        this.checkout()));

    // TODO Perform better shipping validation

    document.querySelector('[name="shippingName"]')
    .addEventListener('change', ({ target: { value }}) => {
      this.validations.shippingName = value.length > 0;
      this.updateCheckoutValidation();
    });

    document.querySelector('[name="shippingAddress"]')
    .addEventListener('change', ({ target: { value }}) => {
      this.validations.shippingAddress = value.length > 0;
      this.updateCheckoutValidation(scope);
    });

    document.querySelector('[name="shippingAddressZip"]')
    .addEventListener('change', ({ target: { value }}) => {
      this.validations.shippingAddressZip = value.length === 5;
      this.updateCheckoutValidation(scope);
    });

    document.querySelector('[name="shippingAddressState"]')
    .addEventListener('change', ({ target: { value }}) => {
      this.validations.shippingAddressState = value.length > 0;
      this.updateCheckoutValidation(scope);
    });

    document.querySelector('[name="shippingAddressCity"]')
    .addEventListener('change', ({ target: { value }}) => {
      this.validations.shippingAddressCity = value.length > 0;
      this.updateCheckoutValidation(scope);
    });

    document.querySelector('[name="shippingCountry"]')
    .addEventListener('change', ({ target: { value }}) => {
      this.validations.shippingCountry = value.length > 0;
      this.updateCheckoutValidation(scope);
    });
  }

  updateCheckoutValidation(scope) {
    if (this.checkValidShippingAddress()) {
      this.checkoutElements().forEach(checkoutElement => checkoutElement.disabled = false);
    } else {
      this.checkoutElements(scope).forEach(checkoutElement => checkoutElement.disabled = true);
    }
  }

  checkValidShippingAddress() {
    return Object.keys(this.validations).map(k => this.validations[k]).reduce((val1, val2) => val1 && val2, true);
  }

  addToCart(button) {
    const skuId = button.dataset.skuId;
    try {
      this.cart[skuId] ? this.cart[skuId] = this.cart[skuId] + 1 : this.cart[skuId] = 1;
      localStorage.setItem(this.id, JSON.stringify(this.cart));
      button.parentElement.classList.add('added-to-cart');
      button.parentElement.querySelector('.cart-count').innerText = this.cart[skuId];
      document.activeElement.blur();
      this.updateCartCount();
    } catch (e) {
      console.error('Error adding to cart', e);
      alert('That one is on us! There was an error adding this item to your cart. We unfortunetly had to empty your cart.');
      this.clearCart();
    }
  }

  removeFromCart(button) {
    const skuId = button.dataset.skuId;
    try {
      if (this.cart[skuId] > 1) {
        this.cart[skuId] ? this.cart[skuId] = this.cart[skuId] - 1 : this.cart[skuId] = 1;
        button.parentElement.querySelector('.cart-count').innerText = this.cart[skuId];
      } else {
        button.parentElement.classList.remove('added-to-cart');
        button.parentElement.querySelector('.cart-count').innerText = '';
        delete this.cart[skuId]
      }
      localStorage.setItem(this.id, JSON.stringify(this.cart));
      this.updateCartCount();
    } catch (e) {
      console.error('Error removing from cart', e);
      alert('That one is on us! There was an error removing this item from your cart. We unfortunetly had to empty your cart.');
      this.clearCart();
    }
  }

  clearCart() {
    localStorage.removeItem(this.id);
    this.cartElement.innerText = 'Cart (0)';
    this.cartElement.classList.remove('has-items');
  }

  updateCartCount() {
    this.cartElement.innerText = `Cart (${this.count})`;
    if (this.count >= 1) {
      this.cartElement.classList.add('has-items');
    } else {
      this.clearCart();
    }
  }

  get cartPreview() {
    const cartPreview = document.createElement('div');
    cartPreview.classList.add('cart-preview');
    const fetches = [];

    this.items.forEach(item => {
      const skuPreview = document.createElement('div');
      skuPreview.classList.add('sku-preview');
      cartPreview.appendChild(skuPreview);

      const skuPreviewReady = new Promise(resolve => {
        fetch(`/products/previews/${item.sku}.fragment.html`)
        .then(response => response.text())
        .then(preview => {
          skuPreview.innerHTML = preview
          this.initSkuCounts();
          this.setListeners(skuPreview);
          resolve();
        });
      });

      fetches.push(skuPreviewReady);
    });

    Promise.all(fetches).then(() => document.querySelector('main').scrollIntoView({behavior: 'smooth'}));

    return cartPreview;
  }

  getShippingInfo() {
    return {
      name: document.querySelector('[name="shippingName"]').value,
      address: document.querySelector('[name="shippingAddress"]').value,
      zip: document.querySelector('[name="shippingAddressZip"]').value,
      state: document.querySelector('[name="shippingAddressState"]').value,
      city: document.querySelector('[name="shippingAddressCity"]').value,
      country: document.querySelector('[name="shippingCountry"]').value,
    }
  }

  checkout() {
    if (this.checkValidShippingAddress()) {
      fetch('/.netlify/functions/checkout', {
        method: 'POST',
        body: JSON.stringify({ cart: this.cart, shippingInfo: this.getShippingInfo() }),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(json => json.sessionId)
      .then(sessionId => {
        this.stripe.redirectToCheckout({ sessionId: sessionId })
      })
      .then(result => {
        if (result && result.error) {
          this.errorMessageElement.textContent = result.error.message;
          this.errorMessageElement.scrollIntoView({behavior: 'smooth'});
        }
      })
      .catch(e => {
        console.log(e);
        alert('There was an error during checkout. Your cart has been saved, please try again.')
      });
    } else {
      alert('Shipping address is invalid');
    }
  }

  get cartCountElements() {
    return document.querySelectorAll('.cart-count');
  }

  checkoutElements(scope = document.body) {
    return scope.querySelectorAll('.checkout');
  }

  removeFromCartElements(scope = document.body) {
    return scope.querySelectorAll('.remove-from-cart');
  }

  addToCartElements(scope = document.body) {
    return scope.querySelectorAll('.add-to-cart');
  }

  addMoreToCartElements(scope = document.body) {
    return scope.querySelectorAll('.add-more-to-cart');
  }

  get cartElement() {
    return document.querySelector('.cart');
  }

  get cartPreviewElement() {
    return document.querySelector('.cart-preview');
  }

  get stripePublicKey() {
    return document.body.dataset.stripePublicKey;
  }

  get redirectUrl() {
    return document.body.dataset.stripeRedirectUrl;
  }

  get successUrl() {
    return this.redirectUrl + '/checkout-success.html';
  }

  get cancelUrl() {
    return this.redirectUrl + '/checkout-canceled.html';
  }

  get errorMessageElement() {
    return document.getElementById('error-message');
  }

  get items() {
    return Object.keys(this.cart).map(key => ({sku: key, quantity: this.cart[key]}));
  }

  get count() {
    return Object.keys(this.cart).map(key => this.cart[key]).reduce((a, b) => a + b, 0);
  }
}
