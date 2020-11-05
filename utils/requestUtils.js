const { createRequest } = require('node-mocks-http');
const getRequest = headers => createRequest({ headers });
const getHeaders = () => {
  return {
    authorization: `Basic YWRtaW5AZW1haWwuY29tOjEyMzQ1Njc4OTA=`,
    accept:
      'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'content-type': 'application/json'
  };
};

/**
 * Decode, parse and return user credentials (username and password)
 * from the Authorization header.
 *
 * @param {http.incomingMessage} request
 * @returns {Array|null} [username, password] or null if header is missing
 */
const getCredentials = request => {
  // TODO: 8.4 Parse user credentials from the "Authorization" request header
  // NOTE: The header is base64 encoded as required by the http standard.
  //       You need to first decode the header back to its original form ("email:password").
  //  See: https://attacomsian.com/blog/nodejs-base64-encode-decode
  //       https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/
  
  //7) should return null when "Authorization" type is not "Basic"
  //8) should return Array when "Authorization" type is "Basic"
  //9) should return parsed credentials in an Array when "Authorization" header is correct

  if (request.headers['authorization'] === undefined || request.headers['authorization'] === "") {
    return null;
    }

  if (request.headers['authorization'].substring(0, 5) !== "Basic" ) {
    return null;  
    }

  else {
    const length = request.headers['authorization'].length;
    const codedCredentials = request.headers['authorization'].substring(6, length+1);
    // create buffer using base64 codec
    const buff = Buffer.from(codedCredentials, 'base64');
    // decode buffer as UTF-8
    const decodedCredentials = buff.toString('utf-8');
    const separatorIndex = decodedCredentials.indexOf(":");
    const credentialsArray = [decodedCredentials.substr(0, separatorIndex), decodedCredentials.substr(separatorIndex+1, decodedCredentials.length)];
    return credentialsArray;
    }  

};
/*
let req = getRequest(getHeaders);
req.headers['authorization'] = `Basic YWRtaW5AZW1haWwuY29tOjEyMzQ1Njc4OTA=`;
console.log(req.headers);
console.log(getCredentials(req));
*/

/**
 * Does the client accept JSON responses?
 *
 * @param {http.incomingMessage} request
 * @returns {boolean}
 */
const acceptsJson = request => {
  // TODO: 8.3 Check if the client accepts JSON as a response based on "Accept" request header
  // NOTE: "Accept" header format allows several comma separated values simultaneously
  // as in "text/html,application/xhtml+xml,application/json,application/xml;q=0.9,*/*;q=0.8"
  // Do not rely on the header value containing only single content type!

  // checks if json is accepted (MIME-type application/json is assumed here)
  //console.log(request.headers["accept"].split(",").includes("application/json"))
  const accept = request.headers["accept"];
  if (typeof accept !== "undefined") {
    const l = accept;
    return (l.includes('application/json') || l.includes('*/*'));
  } else {
    return false;
  }
  // throw new Error('Not Implemented');
};

/**
 * Is the client request content type JSON?
 *
 * @param {http.incomingMessage} request
 * @returns {boolean}
 */
const isJson = request => {
  // TODO: 8.3 Check whether request "Content-Type" is JSON or not
  const h = request.headers["content-type"];
  if (typeof h === "undefined") return false;
  return h.includes("application/json");
  // throw new Error('Not Implemented');
};

/**
 * Asynchronously parse request body to JSON
 *
 * Remember that an async function always returns a Promise which
 * needs to be awaited or handled with then() as in:
 *
 *   const json = await parseBodyJson(request);
 *
 *   -- OR --
 *
 *   parseBodyJson(request).then(json => {
 *     // Do something with the json
 *   })
 *
 * @param {http.IncomingMessage} request
 * @returns {Promise<*>} Promise resolves to JSON content of the body
 */
const parseBodyJson = request => {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('error', err => reject(err));

    request.on('data', chunk => {
      body += chunk.toString();
    });

    request.on('end', () => {
      resolve(JSON.parse(body));
    });
  });
};

module.exports = { acceptsJson, getCredentials, isJson, parseBodyJson };
