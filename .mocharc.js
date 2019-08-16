module.exports = {
  require: ["ts-node/register", "source-map-support/register"],
  reporter: "mochawesome",
  recursive: true,
  spec: "src/**/*.spec.ts",
  extension: [".spec.ts"]
};
