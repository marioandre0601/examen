import { CustomerUpdate, DocumentType, ICustomer, ICustomerRepo } from '../contracts';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
export declare class CustomerRepo implements ICustomerRepo {
    private readonly tableName;
    private readonly client;
    constructor(tableName: string, ddb_client: DynamoDBClient);
    create(customer: ICustomer): Promise<void>;
    getByEmail(email: string): Promise<ICustomer>;
    /**
     * Assuming all items are created using the create transaction there should
     * be no items with the same document, so it's safe to Items[0]
     */
    getByDocument(document: string, document_type: DocumentType): Promise<ICustomer>;
    /**
     * Since the document cann't be updated, no need to mess with transactions here
     */
    update(email: string, update: CustomerUpdate): Promise<ICustomer>;
    delete(email: string): Promise<void>;
}
//# sourceMappingURL=customer-repo.d.ts.map