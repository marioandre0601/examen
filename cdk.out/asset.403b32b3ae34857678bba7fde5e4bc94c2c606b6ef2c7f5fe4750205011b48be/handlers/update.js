"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("source-map-support/register");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const repos_1 = require("../repos");
const use_cases_1 = require("../use-cases");
const ddb_client = new client_dynamodb_1.DynamoDBClient({});
const repo = (0, repos_1.getCustomerRepo)(ddb_client);
const handler = async (event) => {
    console.log(JSON.stringify(event, null, 4));
    const customer = await (0, use_cases_1.updateCustomer)(repo, event.pathParameters?.email, JSON.parse(event.body));
    return {
        statusCode: 200,
        body: JSON.stringify(customer)
    };
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vaGFuZGxlcnMvdXBkYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFxQztBQUVyQyw4REFBMEQ7QUFDMUQsb0NBQTJDO0FBRTNDLDRDQUE4QztBQUU5QyxNQUFNLFVBQVUsR0FBRyxJQUFJLGdDQUFjLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDekMsTUFBTSxJQUFJLEdBQUcsSUFBQSx1QkFBZSxFQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRWpDLE1BQU0sT0FBTyxHQUEyQixLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUU5QyxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUEsMEJBQWMsRUFBQyxJQUFJLEVBQVUsS0FBSyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQWtCLElBQUksQ0FBQyxLQUFLLENBQVMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFFaEksT0FBTztRQUNOLFVBQVUsRUFBRSxHQUFHO1FBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0tBQzlCLENBQUE7QUFDRixDQUFDLENBQUE7QUFUWSxRQUFBLE9BQU8sV0FTbkIifQ==