# S3 Rekognition Wit.ai

This tutorial will teach you how to take images stored in AWS S3 send them to Amazon Rekognition and then send any text detected to wit.ai all with AWS Lambda.  The data is then stored in an Amazon DynamoDB Table.

This tutorial is laid out so that hopefully you will see all the different aspects of the application itself since you will likely use it as part of a larger project not really as a standalone project.  Who knows I might just create a node package eventually since that might help some people as well.

I hopefully laid the steps to success in the [Instructions](https://github.com/nyotalabs/s3-rekognition-witai/blob/master/Instructions.md) file

If you want to skip all that mishegas and just jump into code then: 

1. I think we are kindred spirits

2. The main code is in the lambda folder.  Just make sure to create a role with "AWSLambdaFullAccess" and "AmazonRekognitionFullAccess" policies.

3. I recommend using a 10 second timeout for the lambda function.