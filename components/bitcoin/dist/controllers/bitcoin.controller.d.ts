import { Bitcoin } from '..';
import { Request } from './specs/bitcoin-controller.specs';
export declare class BitcoinController {
    protected queryService: Bitcoin;
    constructor(queryService: Bitcoin);
    callBitcoin(req: Request): Promise<Object>;
}
