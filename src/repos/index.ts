import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { CustomerRepo } from "./customer-repo"

let customer_repo: CustomerRepo
export function getCustomerRepo(ddb_client: DynamoDBClient) {
	if (customer_repo) return customer_repo

	customer_repo = new CustomerRepo(
		<string>process.env.TABLE_NAME,
		ddb_client
	)

	return customer_repo
}
