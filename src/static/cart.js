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

    this.initSkuCounts();
    this.setListeners();
  }

  initSkuCounts() {
    this.cartCountElements.forEach(div => {
      const slug = div.dataset.slug;
      const skuCount = this.cart[slug];
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
  }

  addToCart(button) {
    const slug = button.dataset.slug;
    try {
      this.cart[slug] ? this.cart[slug] = this.cart[slug] + 1 : this.cart[slug] = 1;
      localStorage.setItem(this.id, JSON.stringify(this.cart));
      button.parentElement.classList.add('added-to-cart');
      button.parentElement.querySelector('.cart-count').innerText = this.cart[slug];
      document.activeElement.blur();
      this.updateCartCount();
    } catch (e) {
      console.error('Error adding to cart', e);
      alert('That one is on us! There was an error adding this item to your cart. We unfortunetly had to empty your cart.');
      this.clearCart();
    }
  }

  removeFromCart(button) {
    const slug = button.dataset.slug;
    try {
      if (this.cart[slug] > 1) {
        this.cart[slug] ? this.cart[slug] = this.cart[slug] - 1 : this.cart[slug] = 1;
        button.parentElement.querySelector('.cart-count').innerText = this.cart[slug];
      } else {
        button.parentElement.classList.remove('added-to-cart');
        button.parentElement.querySelector('.cart-count').innerText = '';
        delete this.cart[slug]
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
        fetch(`/products/previews/${item.slug}.fragment.html`)
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

  checkout() {
    fetch('/.netlify/functions/checkout', {
      method: 'POST',
      body: JSON.stringify({ cart: this.cart }),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => json.message)
    .then(message => {
      alert(message);
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
    return Object.keys(this.cart).map(key => ({slug: key, quantity: this.cart[key]}));
  }

  get count() {
    return Object.keys(this.cart).map(key => this.cart[key]).reduce((a, b) => a + b, 0);
  }
}
