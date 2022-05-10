import { Application, Component } from '@loopback/core';
import { BitcoinComponentOptions } from './types';
export declare class BitcoinComponent implements Component {
    private application;
    private options;
    constructor(application: Application, options?: BitcoinComponentOptions);
}
