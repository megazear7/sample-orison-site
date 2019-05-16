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
  const body = JSON.parse(event.body);
  const shippingInfo = body.shippingInfo;
  const items = body.cart;

  const usps = new USPS({
    server: 'http://production.shippingapis.com/ShippingAPI.dll',
    userId: process.env.USPS_USERNAME
  });

  // TODO provide all of the neccessary data here.
  // Origination info should come from the product owners's Contentful profile.
  usps.pricingRateV4({
      Service: '',
      ZipOrigination: '',
      ZipDestination: '',
      Pounds: '',
      Ounces: '',
      Container: '',
      Size: '',
      Width: '',
      Length: '',
      Height: '',
      Girth: '',
    }
  }, createSession);

  function createSession(err, postage) {
    // TODO use the calculated postage cost in the stripe call.

    const entries = await contentfulClient.getEntries({
      'content_type': 'product',
      'fields.skuId[in]': Object.keys(items).join(',')
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: entries.items.map(entry => ({
        name: entry.fields.title,
        description: entry.fields.description,
        images: ['https' + entry.fields.desktopHeroImage.fields.file.url + '?w=100&h=100&fit=thumb'],
        amount: Math.floor(entry.fields.price * 100),
        currency: 'usd',
        quantity: items[entry.fields.skuId]
      })),
      payment_intent_data: {
        shipping: {
          name: shippingInfo.name,
          address: {
            line1: shippingInfo.address,
            city: shippingInfo.city,
            country: shippingInfo.country,
            postal_code: shippingInfo.zip,
            state: shippingInfo.state
          }
        }
      },
      success_url: process.env.HOST + '/checkout-success.html',
      cancel_url: process.env.HOST + '/checkout-canceled.html',
    });

    callback(null, {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id })
    });
  }
}
