"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerRepo = void 0;
const customer_repo_1 = require("./customer-repo");
let customer_repo;
function getCustomerRepo(ddb_client) {
    if (customer_repo)
        return customer_repo;
    customer_repo = new customer_repo_1.CustomerRepo(process.env.TABLE_NAME, ddb_client);
    return customer_repo;
}
exports.getCustomerRepo = getCustomerRepo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9yZXBvcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtREFBOEM7QUFFOUMsSUFBSSxhQUEyQixDQUFBO0FBQy9CLFNBQWdCLGVBQWUsQ0FBQyxVQUEwQjtJQUN6RCxJQUFJLGFBQWE7UUFBRSxPQUFPLGFBQWEsQ0FBQTtJQUV2QyxhQUFhLEdBQUcsSUFBSSw0QkFBWSxDQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFDOUIsVUFBVSxDQUNWLENBQUE7SUFFRCxPQUFPLGFBQWEsQ0FBQTtBQUNyQixDQUFDO0FBVEQsMENBU0MifQ==