if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  siteMetadata: {
    title: "Will Harris website dawg",
  },
  plugins: [
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/content`,
        name: "pages",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/img`,
        name: "images",
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [],
      },
    },
    {
    resolve: "gatsby-plugin-decap-cms",
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
        manualInit: true,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-450199-43",
        head: true,
        respectDNT: true,
      },
    },
    "gatsby-plugin-netlify", // make sure to keep it last in the array
  ],
};
