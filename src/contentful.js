const contentful = require("contentful");
require('dotenv').config();

let config = {
  space: process.env.SPACE_ID,
  accessToken: process.env.CONTENTFUL_API_TOKEN
}

if (process.env.CONTENTFUL_ENV === 'preview') config.host = 'preview.contentful.com';

export default contentful.createClient(config);
