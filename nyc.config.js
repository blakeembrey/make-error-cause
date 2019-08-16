module.exports = {
  all: true,
  exclude: ["**/*.spec.ts"],
  extension: [".ts"],
  include: ["src/**/*.ts"],
  instrument: true,
  reporter: ["text-summary", "html", "json", "lcov"],
  sourceMap: true
};
