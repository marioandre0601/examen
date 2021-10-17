export type DocumentType = 'DNI' | 'RUC' | 'CE'

/**
 * Domain entity
 */
export interface ICustomer {
	email: string
	document_type: DocumentType
	document_number: string
	name: string
	last_name: string
}

export type CustomerUpdate = Pick<ICustomer, 'name' | 'last_name'>

export interface ICustomerRepo {
	getByEmail(email: string): Promise<ICustomer>
	getByDocument(document_number: string, document_type: DocumentType): Promise<ICustomer>
	update(email: string, update: CustomerUpdate): Promise<ICustomer>
	delete(email: string): Promise<void>
	create(customer: ICustomer): Promise<void>
}

export class CustomerNotFoundError extends Error {}
export class CustomerAlreadyExistsError extends Error {}
