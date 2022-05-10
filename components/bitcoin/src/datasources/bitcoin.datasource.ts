import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import fs from 'fs';
import {DEFAULT_BITCOIN_OPTIONS} from '../types';

// @ts-ignore
const bitcoinConfig = DEFAULT_BITCOIN_OPTIONS[process.env.BITCOIN_NETWORK];
console.log("cookieLocation", bitcoinConfig);
const credentials = fs.readFileSync(bitcoinConfig.cookie, {encoding: 'utf8', flag: 'r'});
const base64Auth = stringToBase64(credentials);
const config = {
  name: 'bitcoin',
  connector: 'rest',
  baseURL: `http://bitcoind:${bitcoinConfig.port}/`,
  /*  options: {
     headers: {
       'content-type': 'text/plain',
       Authorization: `Basic ${base64Auth}`,
     },
   }, */
  operations: [
    {
      template: {
        // must. JSONRPC server handles only POST requests
        method: 'POST',
        url: `http://bitcoind:${bitcoinConfig.port}/`,
        headers: {
          'content-type': 'text/plain',
          Authorization: `Basic ${base64Auth}`,
        },
        body: '{arg}',
      },
      functions: {
        callbitcoin: ['arg'],
      },
    },
  ],
};

function stringToBase64(str: string) {
  return Buffer.from(str).toString('base64');
}

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BitcoinDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'bitcoin';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Bitcoin', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
