# bitcoin component

[![LoopBack](https://github.com/loopbackio/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png)](http://loopback.io/)

## Installation

Install BitcoinComponent using `npm`;

```sh
$ [npm install | yarn add] bitcoin
```

## Basic Use

ConfigureA and load BitcoinComponent in the application constructor
as shown below.

```ts
import {BitcoinComponent, BitcoinComponentOptions, DEFAULT_BITCOIN_OPTIONS} from 'bitcoin';
// ...
export class MyApplication extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    const opts: BitcoinComponentOptions = DEFAULT_BITCOIN_OPTIONS;
    this.configure(BitcoinComponentBindings.COMPONENT).to(opts);
    // Put the configuration options here
    // });
    this.component(BitcoinComponent);
    // ...
  }
  // ...
}
```
