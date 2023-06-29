const aws = require('aws-sdk');
const { handler } = require('../src/lambdas/createProduct/index');

jest.mock('process', () => ({
    env: {
        PRODUCT_TABLE: 'product-dev-table',
    },
}));

const result = {
    productName: 'I phone 14',
    price: "$599",
    description: "A brand new i phone",
    reviews: [],
    productType: 'Mobile',
    productId: '1',
    isDeleted: 'false',
    totalAvailable: '200'
}

jest.mock('aws-sdk', () =>{
    const testDocumentClient = {
        put: jest.fn().mockReturnThis(),
        promise: jest.fn(),
    };
    const tDynamoDB = { DocumentClient: jest.fn(() => testDocumentClient) };
    return {
        DynamoDB: tDynamoDB
    }
})

const mdb = new aws.DynamoDB.DocumentClient();

describe('run test cases to create product', () =>{
    test('create the product', async () =>{
        const event = {
            body: JSON.stringify(result)
        }
        mdb.put().promise.mockResolvedValueOnce({ Items: result})
        const response = await handler(event)
        expect(response.statusCode).toEqual(200)
        expect(JSON.parse(response.body)).toStrictEqual(result)
    })
})