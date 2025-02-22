// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import jsdoc from 'eslint-plugin-jsdoc';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            eslintPluginPrettierRecommended,
        ],
        plugins: {
            jsdoc,
        },
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        rules: {
            'jsdoc/no-undefined-types': 'error',
        },
    },
);
