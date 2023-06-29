const aws = require('aws-sdk');
const { handler } = require('../src/lambdas/deleteProduct/index');

jest.mock('process', () => ({
    env: {
        PRODUCT_TABLE: 'product-dev-table',
    },
}));

jest.mock('aws-sdk', () =>{
    const testDocumentClient = {
        update: jest.fn().mockReturnThis(),
        promise: jest.fn(),
    };
    const tDynamoDB = { DocumentClient: jest.fn(() => testDocumentClient) };
    return {
        DynamoDB: tDynamoDB
    }
})

const mdb = new aws.DynamoDB.DocumentClient();

describe('run test cases to delete product', () =>{
    test('delete the product', async () =>{
        const event = {
            queryStringParameters: { productId: '1'}
        }
        mdb.update().promise.mockResolvedValueOnce({ Items: []})
        const response = await handler(event)
        expect(response.statusCode).toEqual(200)
        expect(JSON.parse(response.body).message).toStrictEqual('product with id 1 is deleted')
    })
})