import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {BitcoinRegtestDataSource} from '../datasources';

export interface Mickey {
  jsonrpc: string;
  id: string;
  method: string;
  params: String[];
}

export interface BitcoinRegtest {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  // -------------------------------------------------------
  // Add the three methods here.
  // Make sure the function names and the parameter names matches
  // the ones you defined in the datasource
  getblockcount(arg: string): Promise<string>;
}

export class BitcoinRegtestProvider implements Provider<BitcoinRegtest> {
  constructor(
    // bitcoinRegtest must match the name property in the datasource json file
    @inject('datasources.bitcoinRegtest')
    protected dataSource: BitcoinRegtestDataSource = new BitcoinRegtestDataSource(),
  ) {}

  value(): Promise<BitcoinRegtest> {
    return getService(this.dataSource);
  }
}
