// eslint-disable-next-line no-undef
module.exports = {
    preset: 'ts-jest',
    'testMatch': [
        '**/?(*.)+(spec).+(ts)'
    ],
    globals: {
        'ts-jest': {
            tsconfig: {
                module: 'commonjs',
                moduleResolution: 'node',
                noImplicitAny: false,
                removeComments: true,
                noLib: false,
                emitDecoratorMetadata: true,
                experimentalDecorators: true,
                target: 'es2018',
                sourceMap: true,
                lib: [
                    'es2018'
                ]
            }
        }
    },
    setupFiles: ['<rootDir>/jestsetup.js'],
    testEnvironment: 'node',
    transform: {}
}