module.export = {
    root: true,
    extends: 'standard',
    plugins: ["prettier"],
    env: {
        "browser": true,
        "node": true
    },
    rules: {
        indent: ['error', 4]
    },
    parserOptions: {
        "ecmaVersion": 6,
        "sourceType": "module"
    }
}