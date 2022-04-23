import { LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
export declare class BitcoinDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName: string;
    static readonly defaultConfig: {
        name: string;
        connector: string;
        baseURL: string;
        operations: {
            template: {
                method: string;
                url: string;
                headers: {
                    'content-type': string;
                    Authorization: string;
                };
                body: string;
            };
            functions: {
                callbitcoin: string[];
            };
        }[];
    };
    constructor(dsConfig?: object);
}
