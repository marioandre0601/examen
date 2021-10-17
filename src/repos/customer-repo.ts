import { CustomerNotFoundError, CustomerUpdate, DocumentType, ICustomer, ICustomerRepo } from '../contracts'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

/**
 * Utility functions to between domain entities and database objects
 */

function fromDomainToDb(customer: ICustomer) {
	const { email, name, last_name, document_number, document_type } = customer

	return {
		pk: email,
		name,
		last_name,
		document: `${document_type}:${document_number}`,
	}
}

function fromDbToDomain(item: { [k: string]: any }): ICustomer {
	const { pk, name, last_name, document } = item
	const [ document_type, document_number ] = document.split(':')

	return {
		email: pk,
		name,
		last_name,
		document_number,
		document_type,
	}
}

export class CustomerRepo implements ICustomerRepo {
	private readonly client: DynamoDBDocument

	constructor(
		private readonly tableName: string,
		ddb_client: DynamoDBClient
	) {
		this.client = DynamoDBDocument.from(ddb_client)
	}

	async create(customer: ICustomer) {
		let item = fromDomainToDb(customer)

		await this.client.transactWrite({
			TransactItems: [
				{
					Put: {
						TableName: this.tableName,
						Item: fromDomainToDb(customer),
						ConditionExpression: 'attribute_not_exists(pk)',
					},
				},
				// this item is only used to enforce uniqueness
				{
					Put: {
						TableName: this.tableName,
						Item: {
							// we only set the pk attr
							pk: `document#${item.document}`
						},
						ConditionExpression: 'attribute_not_exists(pk)',
					}
				}
			]
		})
	}

	async getByEmail(email: string) {
		let res = await this.client.get({
			TableName: this.tableName,
			Key: {
				pk: email,
			},
		})

		if (!res.Item)
			throw new CustomerNotFoundError

		return fromDbToDomain(res.Item)
	}

	/**
	 * Assuming all items are created using the create transaction there should
	 * be no items with the same document, so it's safe to Items[0]
	 */
	async getByDocument(document: string, document_type: DocumentType) {
		const res = await this.client.query({
			TableName: this.tableName,
			IndexName: 'document',
			KeyConditionExpression: 'document = :d',
			ExpressionAttributeValues: {
				':d': `${document_type}:${document}`
			}
		})

		if (!(res.Items && res.Items.length > 0))
			throw new CustomerNotFoundError

		return fromDbToDomain(res.Items[0])
	}

	/**
	 * Since the document cann't be updated, no need to mess with transactions here
	 */
	async update(email: string, update: CustomerUpdate) {
		let res = await this.client.update({
			TableName: this.tableName,
			Key: {
				pk: email,
			},
			UpdateExpression: 'set #name = :n, last_name = :l',
			ConditionExpression: 'attribute_exists(pk)',
			ExpressionAttributeValues: {
				':n': update.name,
				':l': update.last_name,
			},
			ExpressionAttributeNames: {
				'#name': 'name'
			},
			ReturnValues: 'ALL_NEW'
		})

		if (!res.Attributes)
			throw new CustomerNotFoundError

		return fromDbToDomain(res.Attributes)
	}

	async delete(email: string) {
		let res = await this.client.get({
			TableName: this.tableName,
			Key: {
				pk: email
			}
		})
		if (!res.Item)
			throw new CustomerNotFoundError

		await this.client.transactWrite({
			TransactItems: [
				{
					Delete: {
						TableName: this.tableName,
						Key: {
							pk: email
						}
					}
				},
				{
					Delete: {
						TableName: this.tableName,
						Key: {
							pk: `document#${res.Item.document}`
						}
					}
				}
			]
		})
	}
}
