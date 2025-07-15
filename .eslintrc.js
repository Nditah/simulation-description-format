module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json'
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        '@typescript-eslint/recommended'
    ],
    rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error', { 
            'argsIgnorePattern': '^_',
            'varsIgnorePattern': '^_'
        }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn'
    },
    env: {
        node: true,
        es2022: true
    },
    ignorePatterns: ['out', 'dist', '**/*.d.ts', 'node_modules'],
    overrides: [
        {
            files: ['**/*.test.ts', '**/test/**/*.ts'],
            env: {
                mocha: true
            },
            globals: {
                suite: 'readonly',
                test: 'readonly',
                setup: 'readonly',
                teardown: 'readonly',
                suiteSetup: 'readonly',
                suiteTeardown: 'readonly'
            },
            rules: {
                '@typescript-eslint/no-explicit-any': 'off'
            }
        }
    ]
};