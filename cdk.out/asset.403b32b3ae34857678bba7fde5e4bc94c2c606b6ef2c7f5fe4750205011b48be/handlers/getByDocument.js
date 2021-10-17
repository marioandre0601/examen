"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("source-map-support/register");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const zod_1 = require("zod");
const repos_1 = require("../repos");
const use_cases_1 = require("../use-cases");
const contracts_1 = require("../contracts");
const ddb_client = new client_dynamodb_1.DynamoDBClient({});
const repo = (0, repos_1.getCustomerRepo)(ddb_client);
const schema = zod_1.z.object({
    document_number: zod_1.z.string(),
    document_type: zod_1.z.enum(['DNI', 'RUC', 'CE'])
});
const handler = async (event) => {
    console.log(JSON.stringify(event, null, 4));
    try {
        const query = schema.parse(event.queryStringParameters);
        const customer = await (0, use_cases_1.getByDocument)(repo, query.document_number, query.document_type);
        return {
            statusCode: 200,
            body: JSON.stringify(customer),
        };
    }
    catch (e) {
        if (e instanceof contracts_1.CustomerNotFoundError) {
            return {
                statusCode: 404,
                body: 'CustomerNotFound'
            };
        }
        else {
            throw e;
        }
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QnlEb2N1bWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2hhbmRsZXJzL2dldEJ5RG9jdW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXFDO0FBRXJDLDhEQUEwRDtBQUMxRCw2QkFBd0I7QUFDeEIsb0NBQTJDO0FBQzNDLDRDQUE2QztBQUM3Qyw0Q0FBcUQ7QUFFckQsTUFBTSxVQUFVLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0FBQ3pDLE1BQU0sSUFBSSxHQUFHLElBQUEsdUJBQWUsRUFBQyxVQUFVLENBQUMsQ0FBQTtBQUV4QyxNQUFNLE1BQU0sR0FBRyxPQUFDLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLGVBQWUsRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFO0lBQzNCLGFBQWEsRUFBRSxPQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztDQUMzQyxDQUFDLENBQUE7QUFFSyxNQUFNLE9BQU8sR0FBMkIsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFOUMsSUFBSTtRQUNILE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUE7UUFFdkQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLHlCQUFhLEVBQ25DLElBQUksRUFDSixLQUFLLENBQUMsZUFBZSxFQUNyQixLQUFLLENBQUMsYUFBYSxDQUNuQixDQUFBO1FBRUQsT0FBTztZQUNOLFVBQVUsRUFBRSxHQUFHO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO1NBQzlCLENBQUE7S0FDRDtJQUFDLE9BQU0sQ0FBQyxFQUFFO1FBQ1YsSUFBSSxDQUFDLFlBQVksaUNBQXFCLEVBQUU7WUFDdkMsT0FBTztnQkFDTixVQUFVLEVBQUUsR0FBRztnQkFDZixJQUFJLEVBQUUsa0JBQWtCO2FBQ3hCLENBQUE7U0FDRDthQUFNO1lBQ04sTUFBTSxDQUFDLENBQUE7U0FDUDtLQUNEO0FBQ0YsQ0FBQyxDQUFBO0FBMUJZLFFBQUEsT0FBTyxXQTBCbkIifQ==