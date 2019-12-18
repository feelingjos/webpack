module.export = {
    root: true,
    extends: 'standard',
    plugins: ["prettier"],
    parser: "babel-eslint",
    env: {
        "es6": true,
        "browser": true,
        "node": true
    },
    rules: {
        indent: ['error', 4]
    },
    parserOptions: {
        "ecmaVersion": 2017,
        "sourceType": "module"
    }
}