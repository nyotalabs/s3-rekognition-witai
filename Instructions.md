# Steps for success

There are some images for the instructions in the images folder that might help you for these instructions.  Not completely sure how helpful they are, so that's why I have made them optional.  And yes, I already changed all the keys found in the images.

## IAM

1. Create a role in IAM (https://console.aws.amazon.com/iam/home#/home).  Select “AWS Service” section.  Then select “Lambda” as the service that will use this role. 

2. Attach "AWSLambdaFullAccess" and "AmazonRekognitionFullAccess" policies for this role.

3. Give your role a name and create it.

## S3

1. Create a S3 bucket (https://s3.console.aws.amazon.com/s3/home) with a unique name, default settings, and hit create.

## DynamoDB

1. Create a DynamoDB table (https://console.aws.amazon.com/dynamodb/home) with a name you like with "timestamp" as your partition key (type "Number") and "filename" as your sort key (type "String"). Keep the default settings checkbox checked. This might take a few minutes to create.

## wit ai

1. Create a new app in wit ai.  It's your choice if you would like to keep it public or private.

2. Type in "hey" into the conversation field, then select the built in "greetings" entity with a value of true.

3. Afterwards hit validate.  You can add more entities if you would like to but I am keeping this simple. Sometimes this step might take a few minutes.  If you want to make sure your wit app is built correctly try typing in more things into the coversation field and see what happens.

4. Go to the wit ai app settings and get the Server Access Token.  You will want to record this somewhere.

## Lambda

1. The code for the project is in the lambda folder.

2. Get your node dependencies.  Then zip up the contents of the lambda folder.

3. Create a lambda function (https://console.aws.amazon.com/lambda/home) from scratch with a name your like and node 8.10 selected.  Select the role you created earlier.  I recommend using a 10 second timeout for the lambda function.

4. Upload your zip file you just created.

5. Create an environment variable called TABLE_NAME with a value as the DynamoDB table name you created. Also create an environment variable called WIT_AI_TOKEN and get the Server Access Token from wit ai.

6. In the designer, select S3.  Then select the bucket you created earlier with "Object Created (All)" as the event type and hit add.

7. Finally hit save.

## Testing and Verfication with Cloudwatch

1. Take any image and upload it to your S3 bucket. It's probably better if you have an image that says "hello" for testing purposes but it doesn't really matter.

2. Then head over to the logs in Cloudwatch (https://console.aws.amazon.com/cloudwatch/home) and look at the logs.  Click on the lambda function you just created "/aws/lambda/[function name]".  You should see a log of the image you just uploaded along with any errors (fingers crossed there are none).

3. Now head to the DynamoDB table you created and click on items.  You should see the Amazon Rekognition and wit ai output in the table (again fingers crossed, granted if there was a problem it should show up in Cloudwatch).

You may have noticed you never actually did anything with Amazon Rekognition with regards to setting it up.  That is because the IAM policies we attached to our role handled that.

Hopefully this tutorial was informative and will help you with larger projects.