/**
* Interface defining the component's options object
*/
export interface BitcoinComponentOptions {
  mainnet: {
    cookie: string,
    port: number
  },
  testnet: {
    cookie: string,
    port: number
  }
  regtest: {
    cookie: string,
    port: number
  }
  signet: {
    cookie: string,
    port: number
  }
}

const basePath = '/bitcoin/.bitcoin';

/**
* Default options for the component
*/
export const DEFAULT_BITCOIN_OPTIONS: BitcoinComponentOptions = {
  mainnet: {
    cookie: `${basePath}/.cookie`,
    port: 8332
  },
  testnet: {
    cookie: `${basePath}/testnet3/.cookie`,
    port: 18332
  },
  regtest: {
    cookie: `${basePath}/regtest/.cookie`,
    port: 18443
  },
  signet: {
    cookie: `${basePath}/signet/.cookie`,
    port: 38332
  }
};
