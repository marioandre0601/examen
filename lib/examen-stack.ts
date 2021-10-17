import * as path from 'path'
import { Code, Function, LayerVersion, Runtime } from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import { AttributeType, BillingMode, ProjectionType, Table } from '@aws-cdk/aws-dynamodb';
import { LambdaIntegration, Model, ResponseType, RestApi } from '@aws-cdk/aws-apigateway';
import { customer_schema, customer_update_schema } from './schemas';

export class ExamenStack extends cdk.Stack {
	constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const table = new Table(this, 'customer-table', {
			partitionKey: {
				name: 'pk',
				type: AttributeType.STRING
			},
			billingMode: BillingMode.PAY_PER_REQUEST,
		})

		table.addGlobalSecondaryIndex({
			indexName: 'document',
			partitionKey: {
				name: 'document',
				type: AttributeType.STRING
			},
			projectionType: ProjectionType.ALL,
		})

		const dependecies_layer = new LayerVersion(this, 'dependencies-layer', {
			code: Code.fromAsset(path.join(__dirname, '../src'), {
				bundling: {
					image: Runtime.NODEJS_14_X.bundlingImage,
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
			compatibleRuntimes: [Runtime.NODEJS_14_X],
			description: 'Dependencies',
		})

		const lambdaCreator = this.lambdaCreator(table, dependecies_layer)

		const create_fn = lambdaCreator(this, 'create-function', 'handlers/create.handler')
		const getByEmail_fn = lambdaCreator(this, 'get-by-email-function', 'handlers/getByEmail.handler')
		const getByDocument_fn = lambdaCreator(this, 'get-by-document-function', 'handlers/getByDocument.handler')
		const update_fn = lambdaCreator(this, 'update-function', 'handlers/update.handler')
		const delete_fn = lambdaCreator(this, 'delete-function', 'handlers/delete.handler')

		const api = new RestApi(this, 'api')

		// to print validation errors
		api.addGatewayResponse('bad-request-gwResponse', {
			type: ResponseType.BAD_REQUEST_BODY,
			statusCode: '400',
			templates: {
				'application/json': `{"message": $context.error.messageString, "detail": "$context.error.validationErrorString"}`,
			}
		})

		const customer_model = api.addModel('customer-model', {
			contentType: 'application/json',
			modelName: `Customer`,
			schema: customer_schema
		})
		const customer_update_model = api.addModel('customer-update-model', {
			contentType: 'application/json',
			modelName: `CustomerUpdate`,
			schema: customer_update_schema
		})

		const full_validator = api.addRequestValidator('full-validator', {
			requestValidatorName: 'full-validator',
			validateRequestBody: true,
			validateRequestParameters: true,
		})

		const params_validator = api.addRequestValidator('params-validator', {
			requestValidatorName: 'params-validator',
			validateRequestBody: false,
			validateRequestParameters: true,
		})


		const root = api.root
		// create customer
		root.addMethod('POST', new LambdaIntegration(create_fn), {
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
		})
		// get by document type and document number
		root.addMethod('GET', new LambdaIntegration(getByDocument_fn), {
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
		})

		const customer = root.addResource('{email}')
		customer.addMethod('GET', new LambdaIntegration(getByEmail_fn), {
			methodResponses: [
				{
					statusCode: '200',
					responseModels: {
						'application/json': customer_model
					},
				},
			],
			requestValidator: full_validator
		})
		customer.addMethod('PUT', new LambdaIntegration(update_fn), {
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
		})
		customer.addMethod('DELETE', new LambdaIntegration(delete_fn), {
			methodResponses: [
				{
					statusCode: '204',
					responseModels: {
						'application/json': Model.EMPTY_MODEL
					}
				}
			],
			requestValidator: full_validator
		})
	}

	/**
	 * Utility function to create almost the same lambda function with different handler
	 * that has read-write access to the table and loads the layer with the dependencies
	 */
	private lambdaCreator(table: Table, dependencies_layer: LayerVersion) {
		return function(scope: cdk.Construct, id: string, handler: string) {
			const fn = new Function(scope, id, {
				runtime: Runtime.NODEJS_14_X,
				code: Code.fromAsset(path.join(__dirname, '../src/dist')),
				handler,
				timeout: Duration.seconds(29),
				environment: {
					TABLE_NAME: table.tableName
				},
				layers: [ dependencies_layer ],
			})
			table.grantReadWriteData(fn)

			return fn
		}
	}
}
