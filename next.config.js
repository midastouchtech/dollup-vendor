/*
* Dollup - Admin Template
* Author: nouthemes
* Homepage: https://themeforest.net/user/nouthemes/portfolio
* Created at: n/a
* Updated at: n/a

* */
const withPlugins = require('next-compose-plugins');
const withImages = require('next-images');
const withTM = require('next-transpile-modules')(['antd', 'antd-img-crop']);

const nextSettings = {
  env: {
    title: 'Dollup',
    ignoreBuildErrors: true,

    titleDescription: 'Marketplace',
    reactStrictMode: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
    publicRuntimeConfig: {
      NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    },
    compiler: {
      reactStrictMode: true,
      styledComponents: true,
    },
  },
  ignoreBuildErrors: true,
};

module.exports = withPlugins([withTM, withImages(), nextSettings]);
