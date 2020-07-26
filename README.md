# Serverless TODO

This project is an implementation of a simple TODO application using AWS Lambda and Serverless framework.

# Functionality of the application

This application allows creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

# TODO items

The application stores TODO items, and each TODO item contains the following fields:

* `todoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a TODO item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) - a URL pointing to an image attached to a TODO item
* `userId` (string) - an id of a user who created a TODO item

# Functions to be implemented

The following functions were implemented, and then configured in the `serverless.yml` file:

* `Auth` - this function implements a custom authorizer for API Gateway that was then added to all other functions.

* `GetTodos` - returns all TODOs for a current user. A user id can be extracted from a JWT token that is sent by the frontend.

* `CreateTodo` - creates a new TODO for a current user. The shape of data sent by a client application to this function can be found in the `CreateTodoRequest.ts` file.

* `UpdateTodo` - updates a TODO item created by a current user.  The shape of data sent by a client application to this function can be found in the `UpdateTodoRequest.ts` file.

The id of an item that should be updated is passed as a URL parameter.

* `DeleteTodo` - deletes a TODO item created by a current user. Expects an id of a TODO item to remove.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a TODO item.

All functions are connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

# Frontend

The `client` folder contains a web application that uses the API developed in the backend. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-2.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

Authentication was implemented via an Auth0 application, where "domain" and "client id" were copied to the `config.ts` file in the `client` folder. Asymmetrically encrypted JWT tokens are used.

# Best practices

The following best practices were used:

## Logging

There is a [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. It is used to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

## Local Secondary Indexing

To store TODO items, a DynamoDB table with local secondary index(es) was created with a resource defined like this:

## Using query()

The `query()` method was used over the `scan()` method to query an index, because of better efficiency.

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Postman collection

An alternative way to test the API is via the Postman collection that contains sample requests, which can be found in this project under `UPDATED_Final_Project.postman_collection.json`. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
