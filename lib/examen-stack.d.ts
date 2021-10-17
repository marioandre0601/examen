import * as cdk from '@aws-cdk/core';
export declare class ExamenStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps);
    /**
     * Utility function to create almost the same lambda function with different handler
     * that has read-write access to the table and loads the layer with the dependencies
     */
    private lambdaCreator;
}
