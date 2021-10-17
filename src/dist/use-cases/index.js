"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getByDocument = exports.getByEmail = void 0;
async function getByEmail(repo, email) {
    const customer = await repo.getByEmail(email);
    return customer;
}
exports.getByEmail = getByEmail;
async function getByDocument(repo, document, document_type) {
    const customer = await repo.getByDocument(document, document_type);
    return customer;
}
exports.getByDocument = getByDocument;
async function createCustomer(repo, customer) {
    await repo.create(customer);
}
exports.createCustomer = createCustomer;
async function updateCustomer(repo, email, update) {
    const updated = await repo.update(email, update);
    return updated;
}
exports.updateCustomer = updateCustomer;
async function deleteCustomer(repo, email) {
    await repo.delete(email);
}
exports.deleteCustomer = deleteCustomer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi91c2UtY2FzZXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBR08sS0FBSyxVQUFVLFVBQVUsQ0FBQyxJQUFtQixFQUFFLEtBQWE7SUFDbEUsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRTdDLE9BQU8sUUFBUSxDQUFBO0FBQ2hCLENBQUM7QUFKRCxnQ0FJQztBQUVNLEtBQUssVUFBVSxhQUFhLENBQUMsSUFBbUIsRUFBRSxRQUFnQixFQUFFLGFBQTJCO0lBQ3JHLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUE7SUFFbEUsT0FBTyxRQUFRLENBQUE7QUFDaEIsQ0FBQztBQUpELHNDQUlDO0FBRU0sS0FBSyxVQUFVLGNBQWMsQ0FBQyxJQUFtQixFQUFFLFFBQW1CO0lBQzVFLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUM1QixDQUFDO0FBRkQsd0NBRUM7QUFFTSxLQUFLLFVBQVUsY0FBYyxDQUFDLElBQW1CLEVBQUUsS0FBYSxFQUFFLE1BQXNCO0lBQzlGLE1BQU0sT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFFaEQsT0FBTyxPQUFPLENBQUE7QUFDZixDQUFDO0FBSkQsd0NBSUM7QUFFTSxLQUFLLFVBQVUsY0FBYyxDQUFDLElBQW1CLEVBQUUsS0FBYTtJQUN0RSxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDekIsQ0FBQztBQUZELHdDQUVDIn0=