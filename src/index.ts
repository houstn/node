import fetch from 'node-fetch';

export interface HoustnOptions {
    url: string;
    organisation: string;
    application: string;
    environment: string;
    interval: number;
    token: string;
    metadata?: any;
}

export class Houstn {
    interval?: NodeJS.Timeout;

    constructor(public options: HoustnOptions) {
        if (options.interval < 5000) {
            throw new Error('Interval must be at least 5 seconds');
        }

        if (!options.url) {
            options.url = "https://hello.houstn.io"
        }
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

        this.interval = setInterval(() => this.ping(metadata), this.options.interval)
    }

    async ping(metadata: any) {
        try {
            const username = `${this.options.organisation}+${this.options.application}+${this.options.environment}`
            const auth = Buffer.from(`${username}:${this.options.token}`).toString('base64');

            await fetch(this.options.url, {
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
}

export default Houstn;
