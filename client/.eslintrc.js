module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: ['react-app'],
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