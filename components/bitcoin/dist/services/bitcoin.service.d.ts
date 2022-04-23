import { Provider } from '@loopback/core';
import { BitcoinDataSource } from '../datasources/bitcoin.datasource';
export interface BitcoinRequest {
    method: string;
    params: String[] | number[];
}
export interface Bitcoin {
    dataSource: {
        callbitcoin(arg: string): Promise<string>;
    };
}
export declare class BitcoinProvider implements Provider<Bitcoin> {
    protected dataSource: BitcoinDataSource;
    constructor(dataSource?: BitcoinDataSource);
    value(): Promise<Bitcoin>;
}
