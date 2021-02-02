import Webpack from 'webpack';

import { isDevelopment } from './utils';
import { clientConfig } from './webpack.main';
// import { rendererConfig } from './webpack.renderer';

function devBuild() {
    const compiler = Webpack([clientConfig,]);

    compiler.watch({ ignored: /node_modules/ }, (err?: Error) => {
        if (err) {
            console.error(err.stack || err);
        }
    });
}

function build() {
    console.log('  Compiling...');
    // rendererConfig
    
    Webpack([clientConfig, ], (err, stats) => {
        if (err || !stats) {
            throw err;
        }

        stats.stats.forEach((stat) => {
            console.log('\n' + stat.toString({
                chunks: false,
                chunkModules: false,
                chunkOrigins: false,
                colors: true,
                modules: false,
                children: false,
                builtAt: false,
            }) + '\n');
        });
    });
}

if (isDevelopment) {
    devBuild();
}
else {
    build();
}
