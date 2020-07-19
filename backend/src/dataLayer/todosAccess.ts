import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly userIdIndex = process.env.USER_ID_INDEX
  ) { }

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient.scan({
      TableName: this.todosTable,
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()

    return todoItem
  }

  async getTodo(todoId: string, userId: string): Promise<TodoItem> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'todoId = :todoId and userId = :userId',
        ExpressionAttributeValues: {
          ':todoId': todoId,
          ':userId': userId
        }
      }).promise()

    const item = result.Items[0]
    return item as TodoItem
  }

  async updateTodo(todoId: string, createdAt: string, todoUpdate: TodoUpdate): Promise<void> {
    this.docClient.update({
      TableName: this.todosTable,
      Key: {
        todoId,
        createdAt
      },
      UpdateExpression: 'set #n = :name, done = :done, dueDate = :dueDate',
      ExpressionAttributeValues: {
        ':name': todoUpdate.name,
        ':done': todoUpdate.done,
        ':dueDate': todoUpdate.dueDate
      },
      ExpressionAttributeNames: { '#n': 'name' },
      ReturnValues: 'UPDATED_NEW',
    }).promise()
  }

  async deleteTodo(todoId: string, createdAt: string): Promise<void> {
    this.docClient.delete({
      TableName: this.todosTable,
      Key: {
        todoId,
        createdAt
      }
    }).promise()
  }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
