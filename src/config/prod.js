module.exports = {
  demoEnv: `ENV${process.env.NODE_ENV}`,
  githubId: process.env.GITHUB_CLIENT_ID || "",
  githubSecret: process.env.GITHUB_CLIENT_SECRET || ""
};
