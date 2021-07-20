"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StripeClient_1 = require("./StripeClient");
jest.mock('inversify');
jest.mock('node-jose', () => {
    return {
        JWS: {
            createSign: jest.fn().mockReturnValue({
                update: jest.fn().mockReturnValue({
                    final: jest.fn().mockReturnValue('final'),
                }),
            }),
        },
        JWK: {
            asKey: jest.fn(),
        }
    };
});
describe('StripeClient Class', () => {
    const API_URL = 'https://api.stripe.com';
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('get apiURL()', () => {
        const SOME_URL = 'url';
        const instance = new StripeClient_1.StripeClient();
        expect(instance.apiURL).toBe(API_URL);
    });
    test('async init(token?)', () => {
        const SOME_TOKEN = 'token1';
        const instance = new StripeClient_1.StripeClient();
        instance.init(SOME_TOKEN);
        expect(instance.token).toBe(SOME_TOKEN);
        process.env.HUB_STRIPE_CLIENT_SECRET = 'token2';
        instance.token = undefined;
        instance.init();
        expect(instance.token).toBe(process.env.HUB_STRIPE_CLIENT_SECRET);
    });
});
//# sourceMappingURL=StripeClient.unit.js.map