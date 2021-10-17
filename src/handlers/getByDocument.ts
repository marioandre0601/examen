import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { z } from 'zod';
import { getCustomerRepo } from '../repos';
import { getByDocument } from '../use-cases';
import { CustomerNotFoundError } from '../contracts';

const ddb_client = new DynamoDBClient({})
const repo = getCustomerRepo(ddb_client)

const schema = z.object({
	document_number: z.string(),
	document_type: z.enum(['DNI', 'RUC', 'CE'])
})

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(JSON.stringify(event, null, 4))

	try {
		const query = schema.parse(event.queryStringParameters)

		const customer = await getByDocument(
			repo,
			query.document_number,
			query.document_type,
		)

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
