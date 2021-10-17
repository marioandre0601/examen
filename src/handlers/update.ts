import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getCustomerRepo } from '../repos';
import { CustomerUpdate } from '../contracts';
import { updateCustomer } from '../use-cases';

const ddb_client = new DynamoDBClient({})
const repo = getCustomerRepo(ddb_client)

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(JSON.stringify(event, null, 4))

	const customer = await updateCustomer(repo, <string>event.pathParameters?.email, <CustomerUpdate>JSON.parse(<string>event.body))

	return {
		statusCode: 200,
		body: JSON.stringify(customer)
	}
}
