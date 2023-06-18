import fetch from 'node-fetch';

export interface HoustnOptions {
    url?: string;
    project?: string;
    application?: string;
    environment?: string;
    interval?: number;
    token?: string;
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

        if (!options.token) {
            console.warn('No token provided, not starting');
            return;
        }

        this.interval = setInterval(() => this.ping(metadata || options.metadata), options.interval)
    }

    async ping(metadata: any) {
        try {
            const options = this.config;

            const url = options.url || "https://hello.houstn.io"
            const path = `${options.project}/${options.application}/${options.environment}`

            await fetch(`${url}/${path}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${options.token}`,
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
            url: this.options.url || process.env.HOUSTN_URL || "https://hello.houstn.io",
            project: this.options.project || process.env.HOUSTN_PROJECT,
            application: this.options.application || process.env.HOUSTN_APP || process.env.HOUSTN_APPLICATION,
            environment: this.options.environment || process.env.HOUSTN_ENV || process.env.HOUSTN_ENVIRONMENT,
            interval: Number(this.options.interval || process.env.HOUSTN_INTERVAL || process.env.HOUSTN_MS || 5000),
            token: this.options.token || process.env.HOUSTN_TOKEN || process.env.HOUSTN_KEY || process.env.HOUSTN_API_KEY,
            metadata: this.options.metadata,
        }

        if (!config.project) {
            throw new Error('No project provided');
        }

        if (!config.application) {
            throw new Error('No application provided');
        }

        if (!config.environment) {
            throw new Error('No environment provided');
        }

        if (config.interval < 5000) {
            throw new Error('Interval must be at least 5 seconds');
        }

        return config;
    }
}

export function start() {
    Houstn.start({
        metadata: process.env.HOUSTN_METADATA
    })
}

export default function houstn(options: HoustnOptions) {
    const houstn = Houstn.init(options);
    return houstn.start(options.metadata)
};

houstn.start = function start(options: HoustnOptions) {
    const houstn = Houstn.init(options);
    return houstn.start(options.metadata)
}
