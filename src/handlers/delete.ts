import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getCustomerRepo } from '../repos';
import { deleteCustomer } from '../use-cases';

const ddb_client = new DynamoDBClient({})
const repo = getCustomerRepo(ddb_client)

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(JSON.stringify(event, null, 4))

	await deleteCustomer(repo, <string>event.pathParameters?.email)

	return {
		statusCode: 204,
		body: ''
	}
}
