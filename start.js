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
    metadata: env('HOUSTN_METADATA'),
});
