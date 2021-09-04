import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

//  curl --user user --data-binary '{"jsonrpc": "1.0", "id": "curltest", "method": "getblockcount", "params": []}' -H 'content-type: text/plain;' http://127.0.0.1:18443/
const config = {
  name: 'bitcoinRegtest',
  connector: 'rest',
  baseURL: 'http://127.0.0.1:18443/',
  options: {
    headers: {
      'content-type': 'text/plain',
      Authorization: 'Basic dXNlcjpwYXNz',
    },
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: 'http://127.0.0.1:18443/',
        headers: {
          'content-type': 'text/plain',
          Authorization: 'Basic dXNlcjpwYXNz',
        },
        body: '{arg}',
      },
      functions: {
        getblockcount: ['arg'],
      },
    },
  ],
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BitcoinRegtestDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'bitcoinRegtest';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.bitcoinRegtest', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
