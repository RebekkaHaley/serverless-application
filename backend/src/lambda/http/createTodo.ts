import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('createTodoHandler')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Log API
  logger.info('Create a todo for current user', event)
  
  // TODO: Implement creating a new TODO item

  // Create a newTodo start
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createTodo(newTodo, jwtToken)
  // Create a newTodo end

  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
