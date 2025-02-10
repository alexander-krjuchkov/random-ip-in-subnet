// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    { ignores: ['dist'] },
    {
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommendedTypeChecked,
            eslintPluginPrettierRecommended,
        ],
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
    },
);
