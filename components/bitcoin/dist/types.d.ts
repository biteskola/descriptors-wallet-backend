/**
* Interface defining the component's options object
*/
export interface BitcoinComponentOptions {
    mainnet: {
        cookie: string;
        port: number;
    };
    testnet: {
        cookie: string;
        port: number;
    };
    regtest: {
        cookie: string;
        port: number;
    };
    signet: {
        cookie: string;
        port: number;
    };
}
/**
* Default options for the component
*/
export declare const DEFAULT_BITCOIN_OPTIONS: BitcoinComponentOptions;
