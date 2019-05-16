import Cart from '/cart.js';

const cart = new Cart();

if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  navigator.serviceWorker.register('/sw.js')
  .then(function(reg) {
    console.debug('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    console.debug('Registration failed with ' + error);
  });
}

window.addEventListener('offline', () => {
  [...document.querySelectorAll('.add-to-cart')].forEach(button => {
    button.disabled = true;
    button.innerText = 'Buying not available when offline';
  });
});

window.addEventListener('online', () => {
  [...document.querySelectorAll('.add-to-cart')].forEach(button => {
    button.disabled = false;
    button.innerText = 'Buy';
  });
});

function loadFragment(path, callback) {
  // Determine the fragment path
  var fragmentPath = path.includes('.html')
    ? path.replace('.html', '.fragment.html')
    : path === '/'
      ? '/index.fragment.html'
      : path + '/index.fragment.html';

  fetch(fragmentPath)
  .then(res => res.status === 404 ? fetch('/404.fragment.html') : res)
  .then(res => res.text())
  .then(fragmentHtml => {
    replacePage(fragmentHtml, path);
    if (typeof callback === 'function') callback(fragmentHtml);
  });
}

function replacePage(fragmentHtml, path) {
  document.querySelector('main').innerHTML = fragmentHtml;
  cart.init();
  document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(link => {
    const hrefNoExt = link.getAttribute('href').replace('.html', '');
    const pathNoExt = path.replace('.html', '')
    if ((hrefNoExt != '/' && pathNoExt.startsWith(hrefNoExt)) || (hrefNoExt === '/' && pathNoExt === '/')) {
      link.classList.add('active');
    }
  });
  document.querySelector('main').scrollIntoView({behavior: 'smooth'});
}

window.addEventListener('popstate', event => {
  event.state && event.state.fragmentHtml
    ? replacePage(event.state.fragmentHtml, event.pathname)
    : loadFragment(document.location.pathname);
});

document.addEventListener("DOMContentLoaded", () => {
  cart.init();

  document.body.addEventListener('click', event => {
    var tag = event.target;

    // It's a left click on an <a href=...>.
    if (tag.tagName == 'A' && tag.href && event.button == 0) {
      // It's a same-origin navigation: a link within the site.
      if (tag.origin == document.location.origin) {
        var oldPath = document.location.pathname;
        var newPath = tag.pathname;

        // Only do this for relative urls
        if (newPath.startsWith('/')) {
          // Prevent the browser from doing the navigation.
          event.preventDefault();

          loadFragment(newPath, fragmentHtml => history.pushState({ fragmentHtml }, '', newPath));
        }
      }
    }
  });
});