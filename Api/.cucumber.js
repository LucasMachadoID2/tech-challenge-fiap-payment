module.exports = {
  default: {
    paths: ["features/**/*.feature"],

    // Mude para esta linha:
    require: ["features/**/*.ts"],
  },
};
