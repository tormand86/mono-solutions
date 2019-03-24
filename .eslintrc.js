module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ["plugin:vue/essential"],
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		"prettier/prettier": "off",
		"vue/html-closing-bracket-spacing": [
			"error",
			{
				selfClosingTag: "never",
			},
		],
	},
	parserOptions: {
		parser: "babel-eslint",
	},
}