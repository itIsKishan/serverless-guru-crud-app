const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.PRODUCT_TABLE

exports.handler = async (event) => {
    try {
        // this lambda will update the product price info of the particulat productId in the product table.
        console.log('INFO', event);
        const { productId } = event.queryStringParameters;
        const { price, productName } = JSON.parse(event.body);
        const params = {
            TableName: TABLE_NAME,
            Key: {
                productId
            },
            UpdateExpression: 'SET price= :price, productName=:name',
            ExpressionAttributeValues: {
                ':price': price,
                ':name': productName
            }
        }
        console.log('params', params);
        await db.update(params).promise();
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
                "Access-Control-Allow-Methods": "*",
            },
            body: JSON.stringify({ message: `product with id ${productId} is updated`})
        }
    } catch (err) {
        console.log('Error',err);
        return err
    }
}