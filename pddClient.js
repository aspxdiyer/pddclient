//import request from 'request';
//import util from './pddUtil';
let request = require('request')
let util = require('./pddUtil')

class PddClient {
  constructor(options) {
    const opts = options || {};
    if (!opts.client_id || !opts.client_secret) {
      throw new Error('client_id和client_secret参数是不能为空');
    }
    this.options = opts;
    this.REST_URL = opts.REST_URL || 'https://gw-api.pinduoduo.com/api/router';
    this.client_id = opts.client_id;
    this.client_secret = opts.client_secret;
  }

  invoke(type, params, reponseNames, defaultResponse, method = 'POST') {
    return new Promise((resolve, reject) => {
      const thisParams = params;
      thisParams.type = type;
      this.request(thisParams, method)
        .then((result) => {
          let response = result;
          //console.log(reponseNames);
          if (reponseNames && reponseNames.length > 0) {
            for (let i = 0; i < reponseNames.length; i++) {
              const name = reponseNames[i];
              response = response[name];
              if (response === undefined) {
                break;
              }
            }
          }
          if (response === undefined) {
            response = defaultResponse;
          }
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  timestamp() {
    return parseInt(new Date().getTime()/1000);//util.YYYYMMDDHHmmss();
  }

  sign(params) {
    const sorted = Object.keys(params).sort();
    let basestring = this.client_secret;
    for (let i = 0; i < sorted.length; i++) {
      const k = sorted[i];
      basestring += k + params[k];
    }
    basestring += this.client_secret;
    //console.log(basestring)
    return util.md5(basestring).toUpperCase();
  }

  request(params, method = 'POST') {
    return new Promise((resolve, reject) => {
      util.checkRequired(params, 'type')
        .then(() => {
          const args = {
            timestamp: this.timestamp(),
            data_type: 'JSON',
            client_id: this.client_id,
            version: 'V1'/*,
          sign_method: 'md5'*/
          };

          for (const k in params) {
            if (typeof params[k] === 'object') {
              args[k] = JSON.stringify(params[k]);
            } else {
              args[k] = params[k];
            }
          }
          args.sign = this.sign(args);
          const url = this.REST_URL;
          const requestOpts = {
            method: method,
            url,
            json: true,
          };
          if (method.toUpperCase() === 'GET') {
            requestOpts.qs = args;
          } else if (method.toUpperCase() === 'POST') {
            requestOpts.form = args;
          } else {
            requestOpts.body = JSON.stringify(args);
          }
          //console.log("url",url,requestOpts);
          request(requestOpts, (error, response, body) => {
            if (error) {
              reject(error);
            }
            if (body) {
              const errRes = body && body.error_response;
              //console.log("body",body);
              if (errRes) {
                let msg = `${errRes.error_msg}, code ${errRes.error_code}`;
                if (errRes.sub_msg && errRes.sub_code) {
                  msg += `; ${errRes.sub_code}: ${errRes.sub_msg}`;
                }
                const e = new Error(msg);
                e.name = 'PddClientError';
                e.code = errRes.error_code;
                e.sub_code = errRes.sub_code;
                e.data = body;
                reject(e);
              }
              resolve(body);
            }
            reject();
          });
        })
        .catch((checkErr) => {
          reject(checkErr);
        });
    });
  }

  execute(apiname, params, method) {
    return this.invoke(apiname, params, [util.getApiResponseName(apiname)], null, method);
    //return this.invoke(apiname, params, [apiname], null, method);
  }
}

module.exports = PddClient

//export default PddClient;
