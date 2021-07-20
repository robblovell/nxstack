// eslint-disable-next-line no-undef
exports.resultProduction = [
    {
        '_id': 'system',
        'appId': 'c6o-system',
        'editions': [
            {
                'name': 'latest',
                'spec': {
                    'navstation': true,
                    'provisioner': {
                        'namespace': 'c6o-system',
                        'tag': 'latest'
                    }
                },
                'status': 'public'
            }
        ],
        'name': 'System'
    },
    {
        '_id': 'store',
        'appId': 'store',
        'editions': [
            {
                'name': 'latest',
                'status': 'public'
            }
        ],
        'name': 'Store'
    }
]
// eslint-disable-next-line no-undef
exports.resultDevelop = [
    {
        '_id': 'system',
        'appId': 'c6o-system',
        'editions': [
            {
                'name': 'latest',
                'spec': {
                    'navstation': true,
                    'provisioner': {
                        'namespace': 'c6o-system',
                        'tag': 'dragon'
                    }
                },
                'status': 'public'
            }
        ],
        'name': 'System'
    },
    {
        '_id': 'store',
        'appId': 'store',
        'editions': [
            {
                'name': 'latest',
                'status': 'public'
            }
        ],
        'name': 'Store'
    }
]
// eslint-disable-next-line no-undef
exports.resultStaging = [
    {
        '_id': 'system',
        'appId': 'c6o-system',
        'editions': [
            {
                'name': 'latest',
                'spec': {
                    'navstation': true,
                    'provisioner': {
                        'namespace': 'c6o-system',
                        'tag': 'canary'
                    }
                },
                'status': 'public'
            }
        ],
        'name': 'System'
    },
    {
        '_id': 'store',
        'appId': 'store',
        'editions': [
            {
                'name': 'latest',
                'status': 'public'
            }
        ],
        'name': 'Store'
    }
]