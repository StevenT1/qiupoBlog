module.exports = {
  "globDirectory": "source/",
  "globPatterns": [
    "**/*.{md,css,png,jpg}"
  ],
  "swDest": "public/sw.js",
  "ignoreURLParametersMatching": [
    /^utm_/,
    /^fbclid$/,
    /^node_modules/
  ]
};