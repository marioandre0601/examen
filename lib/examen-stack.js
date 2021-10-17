"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamenStack = void 0;
const path = require("path");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const aws_dynamodb_1 = require("@aws-cdk/aws-dynamodb");
const aws_apigateway_1 = require("@aws-cdk/aws-apigateway");
const schemas_1 = require("./schemas");
class ExamenStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const table = new aws_dynamodb_1.Table(this, 'customer-table', {
            partitionKey: {
                name: 'pk',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            billingMode: aws_dynamodb_1.BillingMode.PAY_PER_REQUEST,
        });
        table.addGlobalSecondaryIndex({
            indexName: 'document',
            partitionKey: {
                name: 'document',
                type: aws_dynamodb_1.AttributeType.STRING
            },
            projectionType: aws_dynamodb_1.ProjectionType.ALL,
        });
        const dependecies_layer = new aws_lambda_1.LayerVersion(this, 'dependencies-layer', {
            code: aws_lambda_1.Code.fromAsset(path.join(__dirname, '../src'), {
                bundling: {
                    image: aws_lambda_1.Runtime.NODEJS_14_X.bundlingImage,
                    command: [
                        'bash', '-c', [
                            `mkdir /asset-output/nodejs && cd $_`,
                            `cp /asset-input/{package.json,package-lock.json} .`,
                            `npm ci --only=production`,
                        ].join(' && ')
                    ],
                    // magic that erases /.npm permissions errors
                    environment: { HOME: '/tmp/home' },
                },
                // to improve caching
                exclude: ['*', '!package.json', '!package-lock.json'],
            }),
            compatibleRuntimes: [aws_lambda_1.Runtime.NODEJS_14_X],
            description: 'Dependencies',
        });
        const lambdaCreator = this.lambdaCreator(table, dependecies_layer);
        const create_fn = lambdaCreator(this, 'create-function', 'handlers/create.handler');
        const getByEmail_fn = lambdaCreator(this, 'get-by-email-function', 'handlers/getByEmail.handler');
        const getByDocument_fn = lambdaCreator(this, 'get-by-document-function', 'handlers/getByDocument.handler');
        const update_fn = lambdaCreator(this, 'update-function', 'handlers/update.handler');
        const delete_fn = lambdaCreator(this, 'delete-function', 'handlers/delete.handler');
        const api = new aws_apigateway_1.RestApi(this, 'api');
        // to print validation errors
        api.addGatewayResponse('bad-request-gwResponse', {
            type: aws_apigateway_1.ResponseType.BAD_REQUEST_BODY,
            statusCode: '400',
            templates: {
                'application/json': `{"message": $context.error.messageString, "detail": "$context.error.validationErrorString"}`,
            }
        });
        const customer_model = api.addModel('customer-model', {
            contentType: 'application/json',
            modelName: `Customer`,
            schema: schemas_1.customer_schema
        });
        const customer_update_model = api.addModel('customer-update-model', {
            contentType: 'application/json',
            modelName: `CustomerUpdate`,
            schema: schemas_1.customer_update_schema
        });
        const full_validator = api.addRequestValidator('full-validator', {
            requestValidatorName: 'full-validator',
            validateRequestBody: true,
            validateRequestParameters: true,
        });
        const params_validator = api.addRequestValidator('params-validator', {
            requestValidatorName: 'params-validator',
            validateRequestBody: false,
            validateRequestParameters: true,
        });
        const root = api.root;
        // create customer
        root.addMethod('POST', new aws_apigateway_1.LambdaIntegration(create_fn), {
            requestModels: {
                'application/json': customer_model
            },
            methodResponses: [
                {
                    statusCode: '201',
                    responseModels: {
                        'application/json': customer_model
                    },
                },
            ],
            requestValidator: full_validator
        });
        // get by document type and document number
        root.addMethod('GET', new aws_apigateway_1.LambdaIntegration(getByDocument_fn), {
            methodResponses: [
                {
                    statusCode: '200',
                    responseModels: {
                        'application/json': customer_model
                    },
                },
            ],
            requestParameters: {
                'method.request.querystring.document_number': true,
                'method.request.querystring.document_type': true,
            },
            requestValidator: params_validator
        });
        const customer = root.addResource('{email}');
        customer.addMethod('GET', new aws_apigateway_1.LambdaIntegration(getByEmail_fn), {
            methodResponses: [
                {
                    statusCode: '200',
                    responseModels: {
                        'application/json': customer_model
                    },
                },
            ],
            requestValidator: full_validator
        });
        customer.addMethod('PUT', new aws_apigateway_1.LambdaIntegration(update_fn), {
            requestModels: {
                'application/json': customer_update_model
            },
            methodResponses: [
                {
                    statusCode: '200',
                    responseModels: {
                        'application/json': customer_model
                    },
                },
            ],
            requestValidator: full_validator
        });
        customer.addMethod('DELETE', new aws_apigateway_1.LambdaIntegration(delete_fn), {
            methodResponses: [
                {
                    statusCode: '204',
                    responseModels: {
                        'application/json': aws_apigateway_1.Model.EMPTY_MODEL
                    }
                }
            ],
            requestValidator: full_validator
        });
    }
    /**
     * Utility function to create almost the same lambda function with different handler
     * that has read-write access to the table and loads the layer with the dependencies
     */
    lambdaCreator(table, dependencies_layer) {
        return function (scope, id, handler) {
            const fn = new aws_lambda_1.Function(scope, id, {
                runtime: aws_lambda_1.Runtime.NODEJS_14_X,
                code: aws_lambda_1.Code.fromAsset(path.join(__dirname, '../src/dist')),
                handler,
                timeout: core_1.Duration.seconds(29),
                environment: {
                    TABLE_NAME: table.tableName
                },
                layers: [dependencies_layer],
            });
            table.grantReadWriteData(fn);
            return fn;
        };
    }
}
exports.ExamenStack = ExamenStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhhbWVuLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhhbWVuLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZCQUE0QjtBQUM1QixvREFBNEU7QUFDNUUscUNBQXFDO0FBQ3JDLHdDQUF5QztBQUN6Qyx3REFBMEY7QUFDMUYsNERBQTBGO0FBQzFGLHVDQUFvRTtBQUVwRSxNQUFhLFdBQVksU0FBUSxHQUFHLENBQUMsS0FBSztJQUN6QyxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQ25FLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksb0JBQUssQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7WUFDL0MsWUFBWSxFQUFFO2dCQUNiLElBQUksRUFBRSxJQUFJO2dCQUNWLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU07YUFDMUI7WUFDRCxXQUFXLEVBQUUsMEJBQVcsQ0FBQyxlQUFlO1NBQ3hDLENBQUMsQ0FBQTtRQUVGLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQztZQUM3QixTQUFTLEVBQUUsVUFBVTtZQUNyQixZQUFZLEVBQUU7Z0JBQ2IsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU07YUFDMUI7WUFDRCxjQUFjLEVBQUUsNkJBQWMsQ0FBQyxHQUFHO1NBQ2xDLENBQUMsQ0FBQTtRQUVGLE1BQU0saUJBQWlCLEdBQUcsSUFBSSx5QkFBWSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRTtZQUN0RSxJQUFJLEVBQUUsaUJBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLEVBQUU7Z0JBQ3BELFFBQVEsRUFBRTtvQkFDVCxLQUFLLEVBQUUsb0JBQU8sQ0FBQyxXQUFXLENBQUMsYUFBYTtvQkFDeEMsT0FBTyxFQUFFO3dCQUNS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LENBQUMsRUFBRTtZQUM5RCxlQUFlLEVBQUU7Z0JBQ2hCO29CQUNDLFVBQVUsRUFBRSxLQUFLO29CQUNqQixjQUFjLEVBQUU7d0JBQ2Ysa0JBQWtCLEVBQUUsc0JBQUssQ0FBQyxXQUFXO3FCQUNyQztpQkFDRDthQUNEO1lBQ0QsZ0JBQWdCLEVBQUUsY0FBYztTQUNoQyxDQUFDLENBQUE7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssYUFBYSxDQUFDLEtBQVksRUFBRSxrQkFBZ0M7UUFDbkUsT0FBTyxVQUFTLEtBQW9CLEVBQUUsRUFBVSxFQUFFLE9BQWU7WUFDaEUsTUFBTSxFQUFFLEdBQUcsSUFBSSxxQkFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7Z0JBQ2xDLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7Z0JBQzVCLElBQUksRUFBRSxpQkFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztnQkFDekQsT0FBTztnQkFDUCxPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQzdCLFdBQVcsRUFBRTtvQkFDWixVQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVM7aUJBQzNCO2dCQUNELE1BQU0sRUFBRSxDQUFFLGtCQUFrQixDQUFFO2FBQzlCLENBQUMsQ0FBQTtZQUNGLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUU1QixPQUFPLEVBQUUsQ0FBQTtRQUNWLENBQUMsQ0FBQTtJQUNGLENBQUM7Q0FDRDtBQWxMRCxrQ0FrTEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBDb2RlLCBGdW5jdGlvbiwgTGF5ZXJWZXJzaW9uLCBSdW50aW1lIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQXR0cmlidXRlVHlwZSwgQmlsbGluZ01vZGUsIFByb2plY3Rpb25UeXBlLCBUYWJsZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1keW5hbW9kYic7XG5pbXBvcnQgeyBMYW1iZGFJbnRlZ3JhdGlvbiwgTW9kZWwsIFJlc3BvbnNlVHlwZSwgUmVzdEFwaSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCB7IGN1c3RvbWVyX3NjaGVtYSwgY3VzdG9tZXJfdXBkYXRlX3NjaGVtYSB9IGZyb20gJy4vc2NoZW1hcyc7XG5cbmV4cG9ydCBjbGFzcyBFeGFtZW5TdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG5cdGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG5cdFx0c3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cblx0XHRjb25zdCB0YWJsZSA9IG5ldyBUYWJsZSh0aGlzLCAnY3VzdG9tZXItdGFibGUnLCB7XG5cdFx0XHRwYXJ0aXRpb25LZXk6IHtcblx0XHRcdFx0bmFtZTogJ3BrJyxcblx0XHRcdFx0dHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkdcblx0XHRcdH0sXG5cdFx0XHRiaWxsaW5nTW9kZTogQmlsbGluZ01vZGUuUEFZX1BFUl9SRVFVRVNULFxuXHRcdH0pXG5cblx0XHR0YWJsZS5hZGRHbG9iYWxTZWNvbmRhcnlJbmRleCh7XG5cdFx0XHRpbmRleE5hbWU6ICdkb2N1bWVudCcsXG5cdFx0XHRwYXJ0aXRpb25LZXk6IHtcblx0XHRcdFx0bmFtZTogJ2RvY3VtZW50Jyxcblx0XHRcdFx0dHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkdcblx0XHRcdH0sXG5cdFx0XHRwcm9qZWN0aW9uVHlwZTogUHJvamVjdGlvblR5cGUuQUxMLFxuXHRcdH0pXG5cblx0XHRjb25zdCBkZXBlbmRlY2llc19sYXllciA9IG5ldyBMYXllclZlcnNpb24odGhpcywgJ2RlcGVuZGVuY2llcy1sYXllcicsIHtcblx0XHRcdGNvZGU6IENvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9zcmMnKSwge1xuXHRcdFx0XHRidW5kbGluZzoge1xuXHRcdFx0XHRcdGltYWdlOiBSdW50aW1lLk5PREVKU18xNF9YLmJ1bmRsaW5nSW1hZ2UsXG5cdFx0XHRcdFx0Y29tbWFuZDogW1xuXHRcdFx0XHRcdFx0J2Jhc2gnLCAnLWMnLCBbXG5cdFx0XHRcdFx0XHRcdGBta2RpciAvYXNzZXQtb3V0cHV0L25vZGVqcyAmJiBjZCAkX2AsXG5cdFx0XHRcdFx0XHRcdGBjcCAvYXNzZXQtaW5wdXQve3BhY2thZ2UuanNvbixwYWNrYWdlLWxvY2suanNvbn0gLmAsXG5cdFx0XHRcdFx0XHRcdGBucG0gY2kgLS1vbmx5PXByb2R1Y3Rpb25gLFxuXHRcdFx0XHRcdFx0XS5qb2luKCcgJiYgJylcblx0XHRcdFx0XHRdLFxuXHRcdFx0XHRcdC8vIG1hZ2ljIHRoYXQgZXJhc2VzIC8ubnBtIHBlcm1pc3Npb25zIGVycm9yc1xuXHRcdFx0XHRcdGVudmlyb25tZW50OiB7IEhPTUU6ICcvdG1wL2hvbWUnIH0sXG5cdFx0XHRcdH0sXG5cdFx0XHRcdC8vIHRvIGltcHJvdmUgY2FjaGluZ1xuXHRcdFx0XHRleGNsdWRlOiBbJyonLCAnIXBhY2thZ2UuanNvbicsICchcGFja2FnZS1sb2NrLmpzb24nXSxcblx0XHRcdH0pLFxuXHRcdFx0Y29tcGF0aWJsZVJ1bnRpbWVzOiBbUnVudGltZS5OT0RFSlNfMTRfWF0sXG5cdFx0XHRkZXNjcmlwdGlvbjogJ0RlcGVuZGVuY2llcycsXG5cdFx0fSlcblxuXHRcdGNvbnN0IGxhbWJkYUNyZWF0b3IgPSB0aGlzLmxhbWJkYUNyZWF0b3IodGFibGUsIGRlcGVuZGVjaWVzX2xheWVyKVxuXG5cdFx0Y29uc3QgY3JlYXRlX2ZuID0gbGFtYmRhQ3JlYXRvcih0aGlzLCAnY3JlYXRlLWZ1bmN0aW9uJywgJ2hhbmRsZXJzL2NyZWF0ZS5oYW5kbGVyJylcblx0XHRjb25zdCBnZXRCeUVtYWlsX2ZuID0gbGFtYmRhQ3JlYXRvcih0aGlzLCAnZ2V0LWJ5LWVtYWlsLWZ1bmN0aW9uJywgJ2hhbmRsZXJzL2dldEJ5RW1haWwuaGFuZGxlcicpXG5cdFx0Y29uc3QgZ2V0QnlEb2N1bWVudF9mbiA9IGxhbWJkYUNyZWF0b3IodGhpcywgJ2dldC1ieS1kb2N1bWVudC1mdW5jdGlvbicsICdoYW5kbGVycy9nZXRCeURvY3VtZW50LmhhbmRsZXInKVxuXHRcdGNvbnN0IHVwZGF0ZV9mbiA9IGxhbWJkYUNyZWF0b3IodGhpcywgJ3VwZGF0ZS1mdW5jdGlvbicsICdoYW5kbGVycy91cGRhdGUuaGFuZGxlcicpXG5cdFx0Y29uc3QgZGVsZXRlX2ZuID0gbGFtYmRhQ3JlYXRvcih0aGlzLCAnZGVsZXRlLWZ1bmN0aW9uJywgJ2hhbmRsZXJzL2RlbGV0ZS5oYW5kbGVyJylcblxuXHRcdGNvbnN0IGFwaSA9IG5ldyBSZXN0QXBpKHRoaXMsICdhcGknKVxuXG5cdFx0Ly8gdG8gcHJpbnQgdmFsaWRhdGlvbiBlcnJvcnNcblx0XHRhcGkuYWRkR2F0ZXdheVJlc3BvbnNlKCdiYWQtcmVxdWVzdC1nd1Jlc3BvbnNlJywge1xuXHRcdFx0dHlwZTogUmVzcG9uc2VUeXBlLkJBRF9SRVFVRVNUX0JPRFksXG5cdFx0XHRzdGF0dXNDb2RlOiAnNDAwJyxcblx0XHRcdHRlbXBsYXRlczoge1xuXHRcdFx0XHQnYXBwbGljYXRpb24vanNvbic6IGB7XCJtZXNzYWdlXCI6ICRjb250ZXh0LmVycm9yLm1lc3NhZ2VTdHJpbmcsIFwiZGV0YWlsXCI6IFwiJGNvbnRleHQuZXJyb3IudmFsaWRhdGlvbkVycm9yU3RyaW5nXCJ9YCxcblx0XHRcdH1cblx0XHR9KVxuXG5cdFx0Y29uc3QgY3VzdG9tZXJfbW9kZWwgPSBhcGkuYWRkTW9kZWwoJ2N1c3RvbWVyLW1vZGVsJywge1xuXHRcdFx0Y29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcblx0XHRcdG1vZGVsTmFtZTogYEN1c3RvbWVyYCxcblx0XHRcdHNjaGVtYTogY3VzdG9tZXJfc2NoZW1hXG5cdFx0fSlcblx0XHRjb25zdCBjdXN0b21lcl91cGRhdGVfbW9kZWwgPSBhcGkuYWRkTW9kZWwoJ2N1c3RvbWVyLXVwZGF0ZS1tb2RlbCcsIHtcblx0XHRcdGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG5cdFx0XHRtb2RlbE5hbWU6IGBDdXN0b21lclVwZGF0ZWAsXG5cdFx0XHRzY2hlbWE6IGN1c3RvbWVyX3VwZGF0ZV9zY2hlbWFcblx0XHR9KVxuXG5cdFx0Y29uc3QgZnVsbF92YWxpZGF0b3IgPSBhcGkuYWRkUmVxdWVzdFZhbGlkYXRvcignZnVsbC12YWxpZGF0b3InLCB7XG5cdFx0XHRyZXF1ZXN0VmFsaWRhdG9yTmFtZTogJ2Z1bGwtdmFsaWRhdG9yJyxcblx0XHRcdHZhbGlkYXRlUmVxdWVzdEJvZHk6IHRydWUsXG5cdFx0XHR2YWxpZGF0ZVJlcXVlc3RQYXJhbWV0ZXJzOiB0cnVlLFxuXHRcdH0pXG5cblx0XHRjb25zdCBwYXJhbXNfdmFsaWRhdG9yID0gYXBpLmFkZFJlcXVlc3RWYWxpZGF0b3IoJ3BhcmFtcy12YWxpZGF0b3InLCB7XG5cdFx0XHRyZXF1ZXN0VmFsaWRhdG9yTmFtZTogJ3BhcmFtcy12YWxpZGF0b3InLFxuXHRcdFx0dmFsaWRhdGVSZXF1ZXN0Qm9keTogZmFsc2UsXG5cdFx0XHR2YWxpZGF0ZVJlcXVlc3RQYXJhbWV0ZXJzOiB0cnVlLFxuXHRcdH0pXG5cblxuXHRcdGNvbnN0IHJvb3QgPSBhcGkucm9vdFxuXHRcdC8vIGNyZWF0ZSBjdXN0b21lclxuXHRcdHJvb3QuYWRkTWV0aG9kKCdQT1NUJywgbmV3IExhbWJkYUludGVncmF0aW9uKGNyZWF0ZV9mbiksIHtcblx0XHRcdHJlcXVlc3RNb2RlbHM6IHtcblx0XHRcdFx0J2FwcGxpY2F0aW9uL2pzb24nOiBjdXN0b21lcl9tb2RlbFxuXHRcdFx0fSxcblx0XHRcdG1ldGhvZFJlc3BvbnNlczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RhdHVzQ29kZTogJzIwMScsXG5cdFx0XHRcdFx0cmVzcG9uc2VNb2RlbHM6IHtcblx0XHRcdFx0XHRcdCdhcHBsaWNhdGlvbi9qc29uJzogY3VzdG9tZXJfbW9kZWxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHRcdHJlcXVlc3RWYWxpZGF0b3I6IGZ1bGxfdmFsaWRhdG9yXG5cdFx0fSlcblx0XHQvLyBnZXQgYnkgZG9jdW1lbnQgdHlwZSBhbmQgZG9jdW1lbnQgbnVtYmVyXG5cdFx0cm9vdC5hZGRNZXRob2QoJ0dFVCcsIG5ldyBMYW1iZGFJbnRlZ3JhdGlvbihnZXRCeURvY3VtZW50X2ZuKSwge1xuXHRcdFx0bWV0aG9kUmVzcG9uc2VzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdGF0dXNDb2RlOiAnMjAwJyxcblx0XHRcdFx0XHRyZXNwb25zZU1vZGVsczoge1xuXHRcdFx0XHRcdFx0J2FwcGxpY2F0aW9uL2pzb24nOiBjdXN0b21lcl9tb2RlbFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdFx0cmVxdWVzdFBhcmFtZXRlcnM6IHtcblx0XHRcdFx0J21ldGhvZC5yZXF1ZXN0LnF1ZXJ5c3RyaW5nLmRvY3VtZW50X251bWJlcic6IHRydWUsXG5cdFx0XHRcdCdtZXRob2QucmVxdWVzdC5xdWVyeXN0cmluZy5kb2N1bWVudF90eXBlJzogdHJ1ZSxcblx0XHRcdH0sXG5cdFx0XHRyZXF1ZXN0VmFsaWRhdG9yOiBwYXJhbXNfdmFsaWRhdG9yXG5cdFx0fSlcblxuXHRcdGNvbnN0IGN1c3RvbWVyID0gcm9vdC5hZGRSZXNvdXJjZSgne2VtYWlsfScpXG5cdFx0Y3VzdG9tZXIuYWRkTWV0aG9kKCdHRVQnLCBuZXcgTGFtYmRhSW50ZWdyYXRpb24oZ2V0QnlFbWFpbF9mbiksIHtcblx0XHRcdG1ldGhvZFJlc3BvbnNlczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RhdHVzQ29kZTogJzIwMCcsXG5cdFx0XHRcdFx0cmVzcG9uc2VNb2RlbHM6IHtcblx0XHRcdFx0XHRcdCdhcHBsaWNhdGlvbi9qc29uJzogY3VzdG9tZXJfbW9kZWxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHR9LFxuXHRcdFx0XSxcblx0XHRcdHJlcXVlc3RWYWxpZGF0b3I6IGZ1bGxfdmFsaWRhdG9yXG5cdFx0fSlcblx0XHRjdXN0b21lci5hZGRNZXRob2QoJ1BVVCcsIG5ldyBMYW1iZGFJbnRlZ3JhdGlvbih1cGRhdGVfZm4pLCB7XG5cdFx0XHRyZXF1ZXN0TW9kZWxzOiB7XG5cdFx0XHRcdCdhcHBsaWNhdGlvbi9qc29uJzogY3VzdG9tZXJfdXBkYXRlX21vZGVsXG5cdFx0XHR9LFxuXHRcdFx0bWV0aG9kUmVzcG9uc2VzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRzdGF0dXNDb2RlOiAnMjAwJyxcblx0XHRcdFx0XHRyZXNwb25zZU1vZGVsczoge1xuXHRcdFx0XHRcdFx0J2FwcGxpY2F0aW9uL2pzb24nOiBjdXN0b21lcl9tb2RlbFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdFx0cmVxdWVzdFZhbGlkYXRvcjogZnVsbF92YWxpZGF0b3Jcblx0XHR9KVxuXHRcdGN1c3RvbWVyLmFkZE1ldGhvZCgnREVMRVRFJywgbmV3IExhbWJkYUludGVncmF0aW9uKGRlbGV0ZV9mbiksIHtcblx0XHRcdG1ldGhvZFJlc3BvbnNlczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3RhdHVzQ29kZTogJzIwNCcsXG5cdFx0XHRcdFx0cmVzcG9uc2VNb2RlbHM6IHtcblx0XHRcdFx0XHRcdCdhcHBsaWNhdGlvbi9qc29uJzogTW9kZWwuRU1QVFlfTU9ERUxcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdF0sXG5cdFx0XHRyZXF1ZXN0VmFsaWRhdG9yOiBmdWxsX3ZhbGlkYXRvclxuXHRcdH0pXG5cdH1cblxuXHQvKipcblx0ICogVXRpbGl0eSBmdW5jdGlvbiB0byBjcmVhdGUgYWxtb3N0IHRoZSBzYW1lIGxhbWJkYSBmdW5jdGlvbiB3aXRoIGRpZmZlcmVudCBoYW5kbGVyXG5cdCAqIHRoYXQgaGFzIHJlYWQtd3JpdGUgYWNjZXNzIHRvIHRoZSB0YWJsZSBhbmQgbG9hZHMgdGhlIGxheWVyIHdpdGggdGhlIGRlcGVuZGVuY2llc1xuXHQgKi9cblx0cHJpdmF0ZSBsYW1iZGFDcmVhdG9yKHRhYmxlOiBUYWJsZSwgZGVwZW5kZW5jaWVzX2xheWVyOiBMYXllclZlcnNpb24pIHtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGhhbmRsZXI6IHN0cmluZykge1xuXHRcdFx0Y29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oc2NvcGUsIGlkLCB7XG5cdFx0XHRcdHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE0X1gsXG5cdFx0XHRcdGNvZGU6IENvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9zcmMvZGlzdCcpKSxcblx0XHRcdFx0aGFuZGxlcixcblx0XHRcdFx0dGltZW91dDogRHVyYXRpb24uc2Vjb25kcygyOSksXG5cdFx0XHRcdGVudmlyb25tZW50OiB7XG5cdFx0XHRcdFx0VEFCTEVfTkFNRTogdGFibGUudGFibGVOYW1lXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGxheWVyczogWyBkZXBlbmRlbmNpZXNfbGF5ZXIgXSxcblx0XHRcdH0pXG5cdFx0XHR0YWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZm4pXG5cblx0XHRcdHJldHVybiBmblxuXHRcdH1cblx0fVxufVxuIl19