const path = require( 'path' );
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {

    target: 'node',

    externals: [nodeExternals()],

    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "./package.json", to: "package.json"},
                {from: ".env", to: ".env", toType: "file"}
            ]
        })
    ],

    // bundling mode
    mode: 'production',

    // entry files
    entry: './src/server.ts',


    // output bundles (location)
    output: {
        path: path.resolve( __dirname, 'dist' ),
        filename: 'main.js',
    },

    // file resolutions
    resolve: {
        extensions: [ '.ts', '.js' ],
    },

    // loaders
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },

    devServer: {
        static: {
            directory: path.resolve(__dirname, 'src'),
        },
        compress: true,
        port: 9000
    }
};