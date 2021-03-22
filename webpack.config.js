const path = require('path')

module.exports = {
    input: 'src/predux.tsx',
    output: {
        name: 'Predux',
        globals: {
            react: 'React'
        },
        sourcemap: true,
        file: 'predux.js',
        libraryTarget: 'umd',
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            // 如果用了ts文件,使用下面loader翻译成js
            loader: 'awesome-typescript-loader'
        }]
    },
    external: ["react", "react-dom"],
}