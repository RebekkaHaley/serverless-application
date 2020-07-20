/**
 * https://github.com/sgmeyer/auth0-node-jwks-rs256/blob/master/src/lib/JwksClient.js#L7-L28
 **/

export class JwksClient {
    constructor(options) {
      this.options = { strictSsl: true, ...options };
    }
  
    getJwks(cb) {
      request({
        uri: this.options.jwksUri,
        strictSsl: this.options.strictSsl,
        json: true
      }, (err, res) => {
        if (err || res.statusCode < 200 || res.statusCode >= 300) {
          if (res) {
            return cb(new JwksError(res.body && (res.body.message || res.body) || res.statusMessage || `Http Error ${res.statusCode}`));
          }
          return cb(err);
        }
  
        var jwks = res.body.keys;
        return cb(null, jwks);
      });
    }
  }