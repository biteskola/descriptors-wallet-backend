import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {BitcoinDataSource} from '../datasources/bitcoin.datasource';

export interface BitcoinRequest {
  method: string;
  params: String[] | number[];
}

export interface Bitcoin {
  dataSource: {
    // this is where you define the Node.js methods that will be
    // mapped to REST/SOAP/gRPC operations as stated in the datasource
    // json file.
    callbitcoin(arg: string): Promise<string>;
  }
}

export class BitcoinProvider implements Provider<Bitcoin> {
  constructor(
    // bitcoin must match the name property in the datasource json file
    @inject('datasources.bitcoin')
    protected dataSource: BitcoinDataSource = new BitcoinDataSource(),
  ) { }

  value(): Promise<Bitcoin> {
    return getService(this.dataSource);
  }
}
