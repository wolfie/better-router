import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { globalIgnores } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  react.configs.flat.recommended, // This is not a plugin object, but a shareable config object
  react.configs.flat['jsx-runtime'], // Add this if you are using React 17+
  { settings: { react: { version: 'detect' } } },
  reactHooks.configs['recommended-latest'],
  globalIgnores(['./next-js-page/*', './next-js-app/*', 'node_modules/*', 'dist/*']),
  ...tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended
  )
];