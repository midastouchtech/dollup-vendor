/*
* Martfury - Admin Template
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
        titleDescription: 'Marketplace',
    },
};

module.exports = withPlugins([withTM, withImages(), nextSettings]);
