const aws = require('aws-sdk');
const db = new aws.DynamoDB.DocumentClient();
const uuid = require('uuid');
const TABLE_NAME = process.env.PRODUCT_TABLE

exports.handler = async (event) => {
    try {
        /*
         this lambda will create the product info from product table,
         as of now i am storing productId, productName, isDeleted, price, productType, reviews, totalAvialable
         details in the table and returning the object with productId and all above details.
        */
        console.log('INFO', event);
        const data = JSON.parse(event.body);
        const params = {
            TableName: TABLE_NAME,
            Item:{
                productId: uuid.v4(),
                isDeleted: 'false',
                ...data
            }
        }
        console.log('Params', params);
        const { Items } = await db.put(params).promise();
        console.log('Item', Items);
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
                "Access-Control-Allow-Methods": "*",
            },
            body: JSON.stringify(params.Item)
        }
    } catch (err) {
        console.log('Error',err);
        return err
    }
}
