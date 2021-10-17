import {JsonSchemaVersion, JsonSchemaType, JsonSchema} from '@aws-cdk/aws-apigateway';

export const customer_schema: JsonSchema = {
	schema: JsonSchemaVersion.DRAFT7,
	type: JsonSchemaType.OBJECT,
	properties: {
		email: {
			description: 'Primary key',
			type: JsonSchemaType.STRING
		},
		document_number: {
			type: JsonSchemaType.STRING
		},
		document_type: {
			type: JsonSchemaType.STRING,
			enum: [
				'DNI',
				'RUC',
				'CE',
			]
		},
		name: {
			type: JsonSchemaType.STRING
		},
		last_name: {
			type: JsonSchemaType.STRING
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
}

export const customer_update_schema: JsonSchema = {
	schema: JsonSchemaVersion.DRAFT7,
	type: JsonSchemaType.OBJECT,
	description: 'What is possible to update',
	properties: {
		name: {
			type: JsonSchemaType.STRING
		},
		last_name: {
			type: JsonSchemaType.STRING
		},
	},
	additionalProperties: false,
	required: [
		'name',
		'last_name',
	]
}
