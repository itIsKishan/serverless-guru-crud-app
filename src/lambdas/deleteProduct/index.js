const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.PRODUCT_TABLE

exports.handler = async (event) => {
    try {
        /* this lambda will delete the particular product(soft delete) based on productId,
           it will set the isDeleted flag to true whenever the query or get happen this will not be shown in the result
        */
        console.log('INFO', event);
        const { productId } = event.queryStringParameters;
        const params = {
            TableName: TABLE_NAME,
            Key: {
                productId
            },
            UpdateExpression: 'SET isDeleted = :deleted',
            ExpressionAttributeValues: {
                ':deleted' : 'true'
            }
        }
        console.log('Params', params);
        await db.update(params).promise();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
                "Access-Control-Allow-Methods": "*",
            },
            body: JSON.stringify({ message: `product with id ${productId} is deleted`})
        }
    } catch (err) {
        console.log('Error',err);
        return err
    }
}