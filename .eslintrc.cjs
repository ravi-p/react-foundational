// ESLint configuration for a React + TypeScript project using Airbnb style guide and Prettier

module.exports = {
    root: true, // Ensure ESLint looks for configuration only in this file
    env: {
        browser: true, // Enable browser globals like window and document
        es2020: true, // Enable ES2020 globals and syntax
        jest: true, // Enable Jest globals for testing
    },
    extends: [
        'airbnb', // Base Airbnb style guide
        'airbnb-typescript', //
        'airbnb/hooks',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
    ],
    // Ignore build output and config files
    ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'jest.config.ts'],
    // Use the TypeScript parser for ESLint
    parser: '@typescript-eslint/parser',
    // Specify parser options for modern ECMAScript and TypeScript features
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        ecmaFeatures: {
            jsx: true,
        },
    },
    // Include necessary plugins for React, TypeScript, and Prettier
    plugins: ['react', '@typescript-eslint', 'prettier'],
    rules: {
        // React
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],

        // TypeScript
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',

        // Import ordering
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    'type',
                ],
                pathGroups: [
                    {
                        pattern: 'react',
                        group: 'builtin',
                        position: 'before',
                    },
                    {
                        pattern: '@/**',
                        group: 'internal',
                    },
                ],
                pathGroupsExcludedImportTypes: ['react'],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: [
                    '**/*.test.ts',
                    '**/*.test.tsx',
                    '**/*.spec.ts',
                    '**/*.spec.tsx',
                    'vite.config.ts',
                    'jest.config.ts',
                    'src/setup-tests.ts',
                    'src/__mocks__/**',
                ],
            },
        ],

        // Accessibility
        'jsx-a11y/anchor-is-valid': 'warn',

        // Prettier
        'prettier/prettier': 'error',

        // General
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-param-reassign': [
            'error',
            {
                props: true,
                ignorePropertyModificationsFor: ['state', 'config'], // Redux Toolkit (Immer) + Axios interceptors
            },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        'import/ignore': ['node_modules'],
    },
};
