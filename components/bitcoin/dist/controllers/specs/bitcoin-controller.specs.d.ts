export declare class BitcoinRequest {
    method: string;
    params: Array<string | number>;
}
export declare const BitcoinRequestBody: {
    description: string;
    required: boolean;
    content: {
        'application/json': {
            schema: import("@loopback/rest").SchemaRef;
        };
    };
};
export declare type Request = {
    method: string;
    params: string[] | number[];
};
