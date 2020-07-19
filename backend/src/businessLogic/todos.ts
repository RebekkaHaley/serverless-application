import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

import { GroupAccess } from '../dataLayer/todosAccess'
import { CreateGroupRequest } from '../requests/CreateGroupRequest'
import { getUserId } from '../auth/utils'

const groupAccess = new GroupAccess()

export async function getAllGroups(): Promise<Group[]> {
  return groupAccess.getAllGroups()
}

export async function createGroup(
  createGroupRequest: CreateGroupRequest,
  jwtToken: string
): Promise<Group> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await groupAccess.createGroup({
    id: itemId,
    userId: userId,
    name: createGroupRequest.name,
    description: createGroupRequest.description,
    timestamp: new Date().toISOString()
  })
}