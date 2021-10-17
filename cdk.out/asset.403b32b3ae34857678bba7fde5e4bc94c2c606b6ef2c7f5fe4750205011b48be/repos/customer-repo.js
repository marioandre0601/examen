"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepo = void 0;
const contracts_1 = require("../contracts");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
/**
 * Utility functions to between domain entities and database objects
 */
function fromDomainToDb(customer) {
    const { email, name, last_name, document_number, document_type } = customer;
    return {
        pk: email,
        name,
        last_name,
        document: `${document_type}:${document_number}`,
    };
}
function fromDbToDomain(item) {
    const { pk, name, last_name, document } = item;
    const [document_type, document_number] = document.split(':');
    return {
        email: pk,
        name,
        last_name,
        document_number,
        document_type,
    };
}
class CustomerRepo {
    constructor(tableName, ddb_client) {
        this.tableName = tableName;
        this.client = lib_dynamodb_1.DynamoDBDocument.from(ddb_client);
    }
    async create(customer) {
        let item = fromDomainToDb(customer);
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
        });
    }
    async getByEmail(email) {
        let res = await this.client.get({
            TableName: this.tableName,
            Key: {
                pk: email,
            },
        });
        if (!res.Item)
            throw new contracts_1.CustomerNotFoundError;
        return fromDbToDomain(res.Item);
    }
    /**
     * Assuming all items are created using the create transaction there should
     * be no items with the same document, so it's safe to Items[0]
     */
    async getByDocument(document, document_type) {
        const res = await this.client.query({
            TableName: this.tableName,
            IndexName: 'document',
            KeyConditionExpression: 'document = :d',
            ExpressionAttributeValues: {
                ':d': `${document_type}:${document}`
            }
        });
        if (!(res.Items && res.Items.length > 0))
            throw new contracts_1.CustomerNotFoundError;
        return fromDbToDomain(res.Items[0]);
    }
    /**
     * Since the document cann't be updated, no need to mess with transactions here
     */
    async update(email, update) {
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
        });
        if (!res.Attributes)
            throw new contracts_1.CustomerNotFoundError;
        return fromDbToDomain(res.Attributes);
    }
    async delete(email) {
        let res = await this.client.get({
            TableName: this.tableName,
            Key: {
                pk: email
            }
        });
        if (!res.Item)
            throw new contracts_1.CustomerNotFoundError;
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
        });
    }
}
exports.CustomerRepo = CustomerRepo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tZXItcmVwby5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3JlcG9zL2N1c3RvbWVyLXJlcG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNENBQTRHO0FBQzVHLHdEQUF3RDtBQUd4RDs7R0FFRztBQUVILFNBQVMsY0FBYyxDQUFDLFFBQW1CO0lBQzFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLEdBQUcsUUFBUSxDQUFBO0lBRTNFLE9BQU87UUFDTixFQUFFLEVBQUUsS0FBSztRQUNULElBQUk7UUFDSixTQUFTO1FBQ1QsUUFBUSxFQUFFLEdBQUcsYUFBYSxJQUFJLGVBQWUsRUFBRTtLQUMvQyxDQUFBO0FBQ0YsQ0FBQztBQUVELFNBQVMsY0FBYyxDQUFDLElBQTBCO0lBQ2pELE1BQU0sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUE7SUFDOUMsTUFBTSxDQUFFLGFBQWEsRUFBRSxlQUFlLENBQUUsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBRTlELE9BQU87UUFDTixLQUFLLEVBQUUsRUFBRTtRQUNULElBQUk7UUFDSixTQUFTO1FBQ1QsZUFBZTtRQUNmLGFBQWE7S0FDYixDQUFBO0FBQ0YsQ0FBQztBQUVELE1BQWEsWUFBWTtJQUd4QixZQUNrQixTQUFpQixFQUNsQyxVQUEwQjtRQURULGNBQVMsR0FBVCxTQUFTLENBQVE7UUFHbEMsSUFBSSxDQUFDLE1BQU0sR0FBRywrQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDaEQsQ0FBQztJQUVELEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBbUI7UUFDL0IsSUFBSSxJQUFJLEdBQUcsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBRW5DLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFh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