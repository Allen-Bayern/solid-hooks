module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: '3.37',
            },
        ],
        'solid',
        '@babel/preset-typescript',
    ],
};
