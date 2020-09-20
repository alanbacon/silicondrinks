const fetch = require('node-fetch');

async function fetchPopulateBody(...args) {
  const resp = await fetch(...args);
  const contentType = resp.headers.get('content-type');
  if (contentType.includes('application/json')) {
    resp.populatedBody = await resp.json();
  } else {
    resp.populatedBody = await resp.text();
  }
  return resp;
}

module.exports = {
  fetchPopulateBody
};
