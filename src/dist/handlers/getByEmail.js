"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
require("source-map-support/register");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const repos_1 = require("../repos");
const use_cases_1 = require("../use-cases");
const contracts_1 = require("../contracts");
const ddb_client = new client_dynamodb_1.DynamoDBClient({});
const repo = (0, repos_1.getCustomerRepo)(ddb_client);
const handler = async (event) => {
    console.log(JSON.stringify(event, null, 4));
    try {
        // get from dynamodb by email (partition key)
        const customer = await (0, use_cases_1.getByEmail)(repo, event.pathParameters?.email);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QnlFbWFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL2hhbmRsZXJzL2dldEJ5RW1haWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXFDO0FBRXJDLDhEQUEwRDtBQUMxRCxvQ0FBMkM7QUFDM0MsNENBQTBDO0FBQzFDLDRDQUFxRDtBQUVyRCxNQUFNLFVBQVUsR0FBRyxJQUFJLGdDQUFjLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDekMsTUFBTSxJQUFJLEdBQUcsSUFBQSx1QkFBZSxFQUFDLFVBQVUsQ0FBQyxDQUFBO0FBRWpDLE1BQU0sT0FBTyxHQUEyQixLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDM0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUU5QyxJQUFJO1FBQ0gsNkNBQTZDO1FBQzdDLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxzQkFBVSxFQUFDLElBQUksRUFBVSxLQUFLLENBQUMsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBRTVFLE9BQU87WUFDTixVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztTQUM5QixDQUFBO0tBQ0Q7SUFBQyxPQUFNLENBQUMsRUFBRTtRQUNWLElBQUksQ0FBQyxZQUFZLGlDQUFxQixFQUFFO1lBQ3ZDLE9BQU87Z0JBQ04sVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsSUFBSSxFQUFFLGtCQUFrQjthQUN4QixDQUFBO1NBQ0Q7YUFBTTtZQUNOLE1BQU0sQ0FBQyxDQUFBO1NBQ1A7S0FDRDtBQUNGLENBQUMsQ0FBQTtBQXJCWSxRQUFBLE9BQU8sV0FxQm5CIn0=