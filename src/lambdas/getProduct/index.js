const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.PRODUCT_TABLE

exports.handler = async (event) => {
    try {
        // this lambda will get the product info from product table
        console.log('INFO', event);
        const { productName } = event.queryStringParameters;
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'productInfoByName',
            KeyConditionExpression: 'productName = :name AND isDeleted= :deleted',
            ExpressionAttributeValues: {
                ':name' : productName,
                ':deleted': 'false'
            }
        }
        console.log('params', params);
        const { Items } = await db.query(params).promise();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
                "Access-Control-Allow-Methods": "*",
            },
            body: JSON.stringify(Items)
        }
    } catch (err) {
        console.log('Error',err);
        return err
    }
}