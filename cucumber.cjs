module.exports = {
  default: ["--require-module ts-node/register", "--require features/step_definitions/**/*.ts", "features/**/*.feature"].join(" "),
};
