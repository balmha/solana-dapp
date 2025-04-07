#!/bin/bash
yarn build
cp sitemap.xml ./out/
cp robots.txt ./out/
aws s3 sync ./out s3://splforge-webapp/
aws s3 mv s3://splforge-webapp/tokencreator.html s3://splforge-webapp/tokencreator
aws s3 mv s3://splforge-webapp/dashboard.html s3://splforge-webapp/dashboard
aws s3 mv s3://splforge-webapp/liquiditypool.html s3://splforge-webapp/liquiditypool
aws s3 mv s3://splforge-webapp/about.html s3://splforge-webapp/about
aws cloudfront create-invalidation --distribution-id E3GMELXQKVHDTB --paths "/*"