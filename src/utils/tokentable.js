const AWS = require("aws-sdk");

AWS.config.update({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  accessKeyId: process.env.NEXT_PUBLIC_DASHBOARD_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_DASHBOARD_SECRET,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export { dynamoDB };