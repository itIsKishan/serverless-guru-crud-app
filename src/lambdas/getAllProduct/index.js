const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.PRODUCT_TABLE
exports.handler = async (event) => {
    try {
        // this lambda will get all the product info from product table whose isDeleted flag is false
        console.log('INFO', event);
        const params = {
            TableName: TABLE_NAME,
            IndexName: 'isDeletedIndex',
            KeyConditionExpression: 'isDeleted = :deleted',
            ExpressionAttributeValues: {
                ':deleted': 'false'
            }
        }
        console.log('Params', params);
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