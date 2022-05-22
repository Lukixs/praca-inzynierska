module.exports = {
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Dara - Strategic browser board game";
      return args;
    });
  },
};
