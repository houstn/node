import fetch from 'node-fetch';

export interface HoustnOptions {
    url?: string;
    organisation?: string;
    application?: string;
    environment?: string;
    interval?: number;
    token: string;
    metadata?: any;
}

export class Houstn {
    interval?: NodeJS.Timeout;

    constructor(public options: HoustnOptions) {
    }

    static init(options: HoustnOptions): Houstn {
        return new Houstn(options);
    }

    static start(options: HoustnOptions): Houstn {
        const houstn = new Houstn(options);

        if (!options.metadata) {
            console.warn('No default metadata provided, not starting');
            return houstn;
        }

        houstn.start(options.metadata);

        return houstn
    }

    start(metadata: any) {
        console.log('Houstn started');

        const options = this.config;

        this.interval = setInterval(() => this.ping(metadata), options.interval)
    }

    async ping(metadata: any) {
        try {
            const options = this.config;

            const username = `${options.organisation}+${options.application}+${options.environment}`
            const auth = Buffer.from(`${username}:${options.token}`).toString('base64');

            const url = options.url || "https://hello.houstn.io"

            await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Basic ${auth}`,
                },
                body: typeof metadata === 'string' ? metadata : JSON.stringify(metadata)
            })
        } catch (error) {
            console.error('Failed to ping Houstn')
            console.error(error);
        }
    }

    stop() {
        console.log('Houstn stopped');

        clearInterval(this.interval);
    }


    get config() {
        const config = {
            url: this.options.url || "https://hello.houstn.io",
            organisation: this.options.organisation || process.env.HOUSTN_ORG || process.env.HOUSTN_ORGANISATION,
            application: this.options.application || process.env.HOUSTN_APP || process.env.HOUSTN_APPLICATION,
            environment: this.options.environment || process.env.HOUSTN_ENV || process.env.HOUSTN_ENVIRONMENT,
            interval: Number(this.options.interval || process.env.HOUSTN_INTERVAL || process.env.HOUSTN_MS || 5000),
            token: this.options.token || process.env.HOUSTN_TOKEN || process.env.HOUSTN_KEY || process.env.HOUSTN_API_KEY,
            metadata: this.options.metadata,
        }

        if (!config.organisation) {
            throw new Error('No organisation provided');
        }

        if (!config.application) {
            throw new Error('No application provided');
        }

        if (!config.environment) {
            throw new Error('No environment provided');
        }

        if (!config.token) {
            throw new Error('No token provided');
        }

        if (config.interval < 5000) {
            throw new Error('Interval must be at least 5 seconds');
        }

        return config;
    }

}

export default Houstn;
