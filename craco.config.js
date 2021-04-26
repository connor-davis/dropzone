var webpack = require('webpack')

module.exports = {
    webpack: {
        configure: {
            target: 'electron-renderer',
        },
        plugins: [
            new webpack.DefinePlugin({
                $dirname: '__dirname',
            }),
        ],
    },
    style: {
        postcss: {
            plugins: [require('tailwindcss'), require('autoprefixer')],
        },
    },
}
