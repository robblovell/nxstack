import { BaseClient } from './BaseClient'

export class StripeClient extends BaseClient {

    get apiURL() { return 'https://api.stripe.com' }

    async init(token?) {
        await super.init(token || process.env.HUB_STRIPE_CLIENT_SECRET)
    }
}