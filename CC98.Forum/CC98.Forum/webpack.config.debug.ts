import * as Webpack from 'webpack';
import * as path from "path";
import * as HTMLWebpackPlugin from "html-webpack-plugin";
import * as CopyWebpackPlugin from "copy-webpack-plugin";
import * as CleanWebpackPlugin from 'clean-webpack-plugin';
import * as  ExtractTextPlugin from "extract-text-webpack-plugin";

const config: Webpack.Configuration = {

    // webpack 4 only
    mode: "development",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'awesome-typescript-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'sass-loader'
                    ]
                })
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },

    entry: {
        main: './Main.tsx',
        css_blue: './Themes/wuteng_blue.scss',
        css_green: './Themes/forgive_green.scss',
        css_more_green: './Themes/deep_dark_green.scss',
        summer: './Themes/summer.scss'
    },
    output: {
        path: path.resolve(__dirname, 'wwwroot/'),
        // should use absolute path
        publicPath: '/',
        filename: 'static/scripts/[name].js'
    },
    
    devtool: 'source-map',
    
    externals: {
        'jquery': '$',
        'moment': 'moment',
        'editor.md': 'editormd',
        'codemirror': 'CodeMirror',
    },

    plugins: [
        // generate index.html
        new HTMLWebpackPlugin({
			template: 'Template.ejs',
			filename: 'static/index.html',
			inject: false
		}),
        
        // clean wwwroot
        new CleanWebpackPlugin([
            'wwwroot/static/scripts', 
            'wwwroot/static/content', 
            'wwwroot/static/index.html'
        ]),

        new CopyWebpackPlugin([
            { from: 'node_modules/jquery/dist', to: 'static/scripts/lib/jquery/' },
            { from: 'node_modules/moment', to: 'static/scripts/lib/moment/' },
            { from: 'node_modules/font-awesome', to: 'static/content/font-awesome/' },
            { from: 'node_modules/moment', to: 'static/scripts/lib/moment/' },
            { from: 'node_modules/editor.md', to: 'static/scripts/lib/editor.md/' },
            { from: 'node_modules/codemirror', to: 'static/scripts/lib/editor.md/lib/codemirror/' },
            { from: 'node_modules/spectrum-colorpicker/spectrum.js', to: 'static/scripts/lib/spectrum/spectrum.js' },
            { from: 'node_modules/dplayer/dist/DPlayer.min.css', to: 'static/content/DPlayer.min.css' },
            { from: 'node_modules/aplayer/dist/APlayer.min.css', to: 'static/content/APlayer.min.css' }
        ]),

        new ExtractTextPlugin('static/content/[name].css'),

    ],

    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
}

export default config;