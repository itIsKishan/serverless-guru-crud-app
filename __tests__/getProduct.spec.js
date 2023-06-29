const aws = require('aws-sdk');
const { handler } = require('../src/lambdas/getProduct/index');

jest.mock('process', () => ({
    env: {
        PRODUCT_TABLE: 'product-dev-table',
    },
}));

jest.mock('aws-sdk', () =>{
    const testDocumentClient = {
        query: jest.fn().mockReturnThis(),
        promise: jest.fn(),
    };
    const tDynamoDB = { DocumentClient: jest.fn(() => testDocumentClient) };
    return {
        DynamoDB: tDynamoDB
    }
})

const mdb = new aws.DynamoDB.DocumentClient();
const result = [
    {
        productType: "Cloth",
        isDeleted: "false",
        reviews: [],
        price: "999",
        description: "branded pants for men",
        totalAvailable: 150,
        productId: "ff78cc7e-3de2-4937-a2b0-01d39f94cfe2",
        productName: "Pants",
      }
]
describe('run test cases to get product', () =>{
    test('get the product', async () =>{
        const event = {
            queryStringParameters: { productName: 'Pants'},
        }
        mdb.query().promise.mockResolvedValueOnce({ Items: result})
        const response = await handler(event)
        expect(response.statusCode).toEqual(200)
        expect(JSON.parse(response.body)).toStrictEqual(result)
    })
})