import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getCustomerRepo } from '../repos';
import { ICustomer } from '../contracts';
import { createCustomer } from '../use-cases';

const ddb_client = new DynamoDBClient({})
const repo = getCustomerRepo(ddb_client)

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(JSON.stringify(event, null, 4))

	const customer = <ICustomer>JSON.parse(<string>event.body)

	await createCustomer(repo, customer)

	return {
		statusCode: 201,
		body: JSON.stringify(customer)
	}
}
