var houstn = require('./dist/index.js');

function env(name, defaultValue) {
    if (typeof process === 'undefined') {
        return defaultValue;
    }

    if (typeof process.env === 'undefined') {
        return defaultValue;
    }

    return process.env[name] || defaultValue;
}

houstn.Houstn.start({
    organisation: env('HOUSTN_ORGANISATION'),
    application: env('HOUSTN_APPLICATION'),
    environment: env('HOUSTN_ENVIRONMENT'),
    token: env('HOUSTN_TOKEN'),
    metadata: env('HOUSTN_METADATA'),
    interval: Number(env('HOUSTN_INTERVAL', 5))
});
