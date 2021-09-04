const request = require('request');

const options = {
  uri: 'http://127.0.0.1:18443',
  //  headers: {
  //  "content-type": "text/plain"
  // },
  auth: {
    user: 'user',
    pass: 'pass',
  },
  body: JSON.stringify({method: 'getblockcount', params: []}),
};

request.post(options, async (err, response, body) => {
  if (err) {
    console.error('An error has occurred: ', err);
  }
  console.log('body', JSON.parse(body).result, response);
});
