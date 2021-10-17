import { CustomerUpdate, DocumentType, ICustomer, ICustomerRepo } from '../contracts';
export declare function getByEmail(repo: ICustomerRepo, email: string): Promise<ICustomer>;
export declare function getByDocument(repo: ICustomerRepo, document: string, document_type: DocumentType): Promise<ICustomer>;
export declare function createCustomer(repo: ICustomerRepo, customer: ICustomer): Promise<void>;
export declare function updateCustomer(repo: ICustomerRepo, email: string, update: CustomerUpdate): Promise<ICustomer>;
export declare function deleteCustomer(repo: ICustomerRepo, email: string): Promise<void>;
//# sourceMappingURL=index.d.ts.map