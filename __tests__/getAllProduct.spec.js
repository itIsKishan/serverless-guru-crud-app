const aws = require('aws-sdk');
const { handler } = require('../src/lambdas/getAllProduct/index');

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
const results = [
  {
    productType: "Body wash",
    totalAvailable: "200",
    isDeleted: "false",
    description: "a face wash for men and women",
    reviews: [],
    price: "159",
    productId: "c4cbf9f6-813c-4335-ae6d-b6f58ea1900b",
    productName: "face wash",
  },
  {
    productType: "Cloth",
    isDeleted: "false",
    reviews: [],
    price: "999",
    description: "branded pants for men",
    totalAvailable: 150,
    productId: "ff78cc7e-3de2-4937-a2b0-01d39f94cfe2",
    productName: "Pants",
  },
  {
    productType: "Cloth",
    isDeleted: "false",
    reviews: [],
    description: "branded shirts for men",
    price: "699",
    totalAvailable: 100,
    productId: "68015926-dc98-4d32-bd0a-1eace895dae3",
    productName: "T-shirt",
  },
  {
    productType: "Mobile",
    isDeleted: "false",
    reviews: [],
    price: "79,999",
    description: "branded new i phone",
    totalAvailable: 50,
    productId: "bdb6a684-6c76-4679-addb-ff75f81ee27e",
    productName: "I Phone",
  },
  {
    productType: "Book/stationary",
    isDeleted: "false",
    reviews: [],
    price: "250",
    description: "book to read by everyone",
    totalAvailable: 500,
    productId: "7c80dce6-06ed-4614-8db0-da28ff157644",
    productName: "Book1",
  },
];

describe('run test cases to list all product', () =>{
    test('list the products', async () =>{
        const event = {
            queryStringParameters: { id: '1'},
            body: JSON.stringify({"price": "299"})
        }
        mdb.query().promise.mockResolvedValueOnce({ Items: results})
        const response = await handler(event)
        expect(response.statusCode).toEqual(200)
        expect(JSON.parse(response.body)).toStrictEqual(results)
    })
})