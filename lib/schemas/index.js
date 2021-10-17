"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customer_update_schema = exports.customer_schema = void 0;
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
exports.customer_schema = {
    schema: aws_apigateway_1.JsonSchemaVersion.DRAFT7,
    type: aws_apigateway_1.JsonSchemaType.OBJECT,
    properties: {
        email: {
            description: 'Primary key',
            type: aws_apigateway_1.JsonSchemaType.STRING
        },
        document_number: {
            type: aws_apigateway_1.JsonSchemaType.STRING
        },
        document_type: {
            type: aws_apigateway_1.JsonSchemaType.STRING,
            enum: [
                'DNI',
                'RUC',
                'CE',
            ]
        },
        name: {
            type: aws_apigateway_1.JsonSchemaType.STRING
        },
        last_name: {
            type: aws_apigateway_1.JsonSchemaType.STRING
        },
    },
    additionalProperties: false,
    required: [
        'email',
        'document_number',
        'document_type',
        'name',
        'last_name',
    ]
};
exports.customer_update_schema = {
    schema: aws_apigateway_1.JsonSchemaVersion.DRAFT7,
    type: aws_apigateway_1.JsonSchemaType.OBJECT,
    description: 'What is possible to update',
    properties: {
        name: {
            type: aws_apigateway_1.JsonSchemaType.STRING
        },
        last_name: {
            type: aws_apigateway_1.JsonSchemaType.STRING
        },
    },
    additionalProperties: false,
    required: [
        'name',
        'last_name',
    ]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0REFBc0Y7QUFFekUsUUFBQSxlQUFlLEdBQWU7SUFDMUMsTUFBTSxFQUFFLGtDQUFpQixDQUFDLE1BQU07SUFDaEMsSUFBSSxFQUFFLCtCQUFjLENBQUMsTUFBTTtJQUMzQixVQUFVLEVBQUU7UUFDWCxLQUFLLEVBQUU7WUFDTixXQUFXLEVBQUUsYUFBYTtZQUMxQixJQUFJLEVBQUUsK0JBQWMsQ0FBQyxNQUFNO1NBQzNCO1FBQ0QsZUFBZSxFQUFFO1lBQ2hCLElBQUksRUFBRSwrQkFBYyxDQUFDLE1BQU07U0FDM0I7UUFDRCxhQUFhLEVBQUU7WUFDZCxJQUFJLEVBQUUsK0JBQWMsQ0FBQyxNQUFNO1lBQzNCLElBQUksRUFBRTtnQkFDTCxLQUFLO2dCQUNMLEtBQUs7Z0JBQ0wsSUFBSTthQUNKO1NBQ0Q7UUFDRCxJQUFJLEVBQUU7WUFDTCxJQUFJLEVBQUUsK0JBQWMsQ0FBQyxNQUFNO1NBQzNCO1FBQ0QsU0FBUyxFQUFFO1lBQ1YsSUFBSSxFQUFFLCtCQUFjLENBQUMsTUFBTTtTQUMzQjtLQUNEO0lBQ0Qsb0JBQW9CLEVBQUUsS0FBSztJQUMzQixRQUFRLEVBQUU7UUFDVCxPQUFPO1FBQ1AsaUJBQWlCO1FBQ2pCLGVBQWU7UUFDZixNQUFNO1FBQ04sV0FBVztLQUNYO0NBQ0QsQ0FBQTtBQUVZLFFBQUEsc0JBQXNCLEdBQWU7SUFDakQsTUFBTSxFQUFFLGtDQUFpQixDQUFDLE1BQU07SUFDaEMsSUFBSSxFQUFFLCtCQUFjLENBQUMsTUFBTTtJQUMzQixXQUFXLEVBQUUsNEJBQTRCO0lBQ3pDLFVBQVUsRUFBRTtRQUNYLElBQUksRUFBRTtZQUNMLElBQUksRUFBRSwrQkFBYyxDQUFDLE1BQU07U0FDM0I7UUFDRCxTQUFTLEVBQUU7WUFDVixJQUFJLEVBQUUsK0JBQWMsQ0FBQyxNQUFNO1NBQzNCO0tBQ0Q7SUFDRCxvQkFBb0IsRUFBRSxLQUFLO0lBQzNCLFFBQVEsRUFBRTtRQUNULE1BQU07UUFDTixXQUFXO0tBQ1g7Q0FDRCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtKc29uU2NoZW1hVmVyc2lvbiwgSnNvblNjaGVtYVR5cGUsIEpzb25TY2hlbWF9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5JztcblxuZXhwb3J0IGNvbnN0IGN1c3RvbWVyX3NjaGVtYTogSnNvblNjaGVtYSA9IHtcblx0c2NoZW1hOiBKc29uU2NoZW1hVmVyc2lvbi5EUkFGVDcsXG5cdHR5cGU6IEpzb25TY2hlbWFUeXBlLk9CSkVDVCxcblx0cHJvcGVydGllczoge1xuXHRcdGVtYWlsOiB7XG5cdFx0XHRkZXNjcmlwdGlvbjogJ1ByaW1hcnkga2V5Jyxcblx0XHRcdHR5cGU6IEpzb25TY2hlbWFUeXBlLlNUUklOR1xuXHRcdH0sXG5cdFx0ZG9jdW1lbnRfbnVtYmVyOiB7XG5cdFx0XHR0eXBlOiBKc29uU2NoZW1hVHlwZS5TVFJJTkdcblx0XHR9LFxuXHRcdGRvY3VtZW50X3R5cGU6IHtcblx0XHRcdHR5cGU6IEpzb25TY2hlbWFUeXBlLlNUUklORyxcblx0XHRcdGVudW06IFtcblx0XHRcdFx0J0ROSScsXG5cdFx0XHRcdCdSVUMnLFxuXHRcdFx0XHQnQ0UnLFxuXHRcdFx0XVxuXHRcdH0sXG5cdFx0bmFtZToge1xuXHRcdFx0dHlwZTogSnNvblNjaGVtYVR5cGUuU1RSSU5HXG5cdFx0fSxcblx0XHRsYXN0X25hbWU6IHtcblx0XHRcdHR5cGU6IEpzb25TY2hlbWFUeXBlLlNUUklOR1xuXHRcdH0sXG5cdH0sXG5cdGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcblx0cmVxdWlyZWQ6IFtcblx0XHQnZW1haWwnLFxuXHRcdCdkb2N1bWVudF9udW1iZXInLFxuXHRcdCdkb2N1bWVudF90eXBlJyxcblx0XHQnbmFtZScsXG5cdFx0J2xhc3RfbmFtZScsXG5cdF1cbn1cblxuZXhwb3J0IGNvbnN0IGN1c3RvbWVyX3VwZGF0ZV9zY2hlbWE6IEpzb25TY2hlbWEgPSB7XG5cdHNjaGVtYTogSnNvblNjaGVtYVZlcnNpb24uRFJBRlQ3LFxuXHR0eXBlOiBKc29uU2NoZW1hVHlwZS5PQkpFQ1QsXG5cdGRlc2NyaXB0aW9uOiAnV2hhdCBpcyBwb3NzaWJsZSB0byB1cGRhdGUnLFxuXHRwcm9wZXJ0aWVzOiB7XG5cdFx0bmFtZToge1xuXHRcdFx0dHlwZTogSnNvblNjaGVtYVR5cGUuU1RSSU5HXG5cdFx0fSxcblx0XHRsYXN0X25hbWU6IHtcblx0XHRcdHR5cGU6IEpzb25TY2hlbWFUeXBlLlNUUklOR1xuXHRcdH0sXG5cdH0sXG5cdGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcblx0cmVxdWlyZWQ6IFtcblx0XHQnbmFtZScsXG5cdFx0J2xhc3RfbmFtZScsXG5cdF1cbn1cbiJdfQ==