module.exports = {
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
          "modules": true
        }
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        "camelcase": 2,
        "indent": [
          2,
          "tab"
        ],
        "semi": [
          2,
          "always"
        ],
        "array-bracket-spacing": [
          2,
          "always"
        ],
        "block-spacing": [
          2,
          "always"
        ],
        "comma-spacing": 2,
        "keyword-spacing": 2,
        "space-infix-ops": 2,
        "arrow-spacing": 2,
    }
}