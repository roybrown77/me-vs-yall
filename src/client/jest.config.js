module.exports = {
  setupFiles: ["dotenv/config"],
  moduleNameMapper: {
      ".+\\.(css|styl|less|sass|scss|png|jpg|gif|jpeg|webm|m4a|ttf|woff|woff2)$": "identity-obj-proxy"
    }
};