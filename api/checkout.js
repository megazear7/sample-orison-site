if (! process.env.PREVENT_DOT_ENV) require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const contentful = require('contentful');

let config = {
  space: process.env.SPACE_ID,
  accessToken: process.env.CONTENTFUL_API_TOKEN
}

if (process.env.CONTENTFUL_ENV === 'preview') config.host = 'preview.contentful.com';
const contentfulClient = contentful.createClient(config)

exports.handler = async (event, context, callback) => {
  const cart = JSON.parse(event.body).cart;

  console.log(cart);

  const entries = await contentfulClient.getEntries({
    'content_type': 'product',
    'fields.slug[in]': Object.keys(cart).join(',')
  });

  console.log(entries.items);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({ message: 'You purchased these items: ' +
          entries.items.map(item => cart[item.fields.slug] + ' ' + item.fields.title).join(', ') })
  });
}
