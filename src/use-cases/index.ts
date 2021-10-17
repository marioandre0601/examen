// May seem as repeated code, but was made to explain the repository pattern
import { CustomerUpdate, DocumentType, ICustomer, ICustomerRepo } from '../contracts'

export async function getByEmail(repo: ICustomerRepo, email: string) {
	const customer = await repo.getByEmail(email)

	return customer
}

export async function getByDocument(repo: ICustomerRepo, document: string, document_type: DocumentType) {
	const customer = await repo.getByDocument(document, document_type)

	return customer
}

export async function createCustomer(repo: ICustomerRepo, customer: ICustomer) {
	await repo.create(customer)
}

export async function updateCustomer(repo: ICustomerRepo, email: string, update: CustomerUpdate) {
	const updated = await repo.update(email, update)

	return updated
}

export async function deleteCustomer(repo: ICustomerRepo, email: string) {
	await repo.delete(email)
}
