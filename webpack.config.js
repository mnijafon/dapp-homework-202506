// webpack-merge：用于合并多个 Webpack 配置对象，避免重复配置。
const merge = require('webpack-merge');
// yargs-parser：解析命令行参数，例如 webpack --mode production 中的 --mode。
const argv = require('yargs-parser')(process.argv.slice(2));
// path.resolve：处理文件路径，确保不同操作系统路径格式一致。
const { resolve } = require('path');
// 从命令行参数中提取 mode 值（如 production、development），默认使用 development。
const _mode = argv.mode || 'development';
// 根据 _mode 动态加载对应的配置文件（如 webpack.development.js 或 webpack.production.js）。
const _mergeConfig = require(`./config/webpack.${_mode}.js`);
// 在每次构建前自动清理输出目录（如 dist），避免旧文件残留。
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 将 CSS 代码从 JavaScript 包中分离出来，生成独立的 CSS 文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const _modeflag = _mode === 'production' ? true : false;
// const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const WebpackBar = require('webpackbar');
// 构建时的进度条。
const { ThemedProgressPlugin } = require('themed-progress-plugin');

// 添加调试信息
console.log('Current mode:', _mode);
console.log('Entry path:', resolve(__dirname, 'src/index.tsx'));

const webpackBaseConfig = {
    //入口文件，指定 Webpack 开始构建的入口文件。
    entry: {
        main: resolve(__dirname, 'src/index.tsx'),
    },
    // 输出配置
    output: {
        path: resolve(__dirname, 'dist'),
    },
    resolve: {
        // 配置路径别名，运行时或打包时才不会报错
        alias: {
            '@': resolve('src/'),
            '@components': resolve('src/components'),
            '@hooks': resolve('src/hooks'),
            '@pages': resolve('src/pages'),
            '@layouts': resolve('src/layouts'),
            '@assets': resolve('src/assets'),
            '@states': resolve('src/states'),
            '@service': resolve('src/service'),
            '@utils': resolve('src/utils'),
            '@lib': resolve('src/lib'),
            '@constants': resolve('src/constants'),
            '@connections': resolve('src/connections'),
            '@abis': resolve('src/abis'),
            '@types': resolve('src/types'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx'], // 添加这个
    },
    // 模块处理规则
    module: {
        rules: [
            // 使用 SWC（Speedy Web Compiler）编译 TypeScript 和 JSX 文件。对比 Babel：SWC 基于 Rust 实现，编译速度比 Babel 快 20x-70x。
            {
                test: /\.(ts|tsx)$/,
                exclude: /(node_modules)/,
                use: {
                    // `.swcrc` can be used to configure swc
                    loader: 'swc-loader',
                },
            },
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: [
                    // style-loader：将 CSS 以 <style> 标签插入 HTML（开发环境常用）。MiniCssExtractPlugin：生成单独的 CSS 文件（生产环境优化）。
                    MiniCssExtractPlugin.loader,
                    // 'style-loader'，先让postcss-loader处理@import的文件。Webpack 加载器按从后到前的顺序执行
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    // 使用 PostCSS 插件转换 CSS，例如添加浏览器前缀（通过autoprefixer）、处理 CSS Modules、压缩 CSS 等。
                    // 自动添加浏览器前缀（如-webkit-, -moz-）、使用未来的 CSS 特性（通过 Babel-like 转换）、压缩或优化 CSS
                    // 使用postcss-loader后，tailwindcss才能生效
                    'postcss-loader',
                ],
                // use: ['style-loader', 'css-loader'],
            },
        ],
    },
    // 解析策略（路径别名、扩展名等）
    // resolve: {
    //
    // },
    // 插件配置
    plugins: [
        /**
         * 将 CSS 从 JS 包中提取到独立的文件（如 main.css），而非内联到 JS 中。将CSS和JS分开，并行加载：浏览器可同时下载 CSS 和 JS，减少首屏加载时间。
         * 文件体积：通过 CSS 压缩工具（如 css-minimizer-webpack-plugin）进一步减小体积。
         * 缓存效率：
         * CSS 内容不变时，哈希值不变，浏览器直接使用缓存。
         * JS 更新时，CSS 缓存不受影响。
         */
        new MiniCssExtractPlugin({
            filename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
            chunkFilename: _modeflag ? 'styles/[name].[contenthash:5].css' : 'styles/[name].css',
            ignoreOrder: false,
        }),
        new CleanWebpackPlugin(),
        new ThemedProgressPlugin(),
    ]
};
module.exports = merge.default(webpackBaseConfig, _mergeConfig);