// eslint-disable-next-line no-undef
module.exports = {
    'roots': [
        '<rootDir>/'
    ],
    'testMatch': [
        '**/?(*.)+(test).+(ts)'
    ],
    'transform': {
        '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    'reporters': [
        'default',
        ['jest-html-reporters', {
            'publicPath': './coverage',
            'filename': 'report.html',
            'expand': true
        }]
    ],
    setupFiles: ['<rootDir>/jestsetup.js'],
}