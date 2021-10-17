import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { getCustomerRepo } from '../repos';
import { getByEmail } from '../use-cases';
import { CustomerNotFoundError } from '../contracts';

const ddb_client = new DynamoDBClient({})
const repo = getCustomerRepo(ddb_client)

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(JSON.stringify(event, null, 4))

	try {
		// get from dynamodb by email (partition key)
		const customer = await getByEmail(repo, <string>event.pathParameters?.email)

		return {
			statusCode: 200,
			body: JSON.stringify(customer),
		}
	} catch(e) {
		if (e instanceof CustomerNotFoundError) {
			return {
				statusCode: 404,
				body: 'CustomerNotFound'
			}
		} else {
			throw e
		}
	}
}
