import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TodoItem, TodoUpdate } from '../models/Todo.d';
import { encodeNextKey } from './utils';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('todoAccess');

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)
  ) {}

  async getTodos(userId: string,nextKey, limit, orderBy): Promise<{
    todoList: TodoItem[],
    nextKey:string
  }> {
    logger.info('Getting all todo items');
    // Order by created date by default
    let indexName = process.env.TODOS_CREATED_AT_INDEX;
    if (!!orderBy && orderBy === "dueDate") {
        indexName = process.env.TODOS_DUE_DATE_INDEX; 
    }

    const params = {
      TableName: this.todosTable,
      IndexName: indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: limit,
      ScanIndexForward: false,
      ExclusiveStartKey: nextKey
    };
    console.log("===============================>",limit,nextKey);
    
    const result = await this.docClient.query(params).promise();
    return {
      todoList: result.Items as TodoItem[],
      nextKey: encodeNextKey(result.LastEvaluatedKey)
    };
  }

  async getTodo(userId: string, todoId: string): Promise<TodoItem> {
    logger.info(`Getting todo item: ${todoId}`);
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId and todoId = :todoId',
        ExpressionAttributeValues: {
          ':userId': userId,
          ':todoId': todoId
        }
      })
      .promise();
    const todoItem = result.Items[0];
    return todoItem as TodoItem;
  }

  async createTodo(newTodo: TodoItem): Promise<TodoItem> {
    logger.info(`Creating new todo item: ${newTodo.todoId}`);
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: newTodo
      })
      .promise();
    return newTodo;
  }

  async updateTodo(userId: string, todoId: string, updateData: TodoUpdate): Promise<void> {
    logger.info(`Updating a todo item: ${todoId}`);
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
          ':n': updateData.name,
          ':due': updateData.dueDate,
          ':dn': updateData.done
        }
      })
      .promise();
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: { userId, todoId }
      })
      .promise();
  }

  async saveImgUrl(userId: string, todoId: string, bucketName: string): Promise<void> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, todoId },
        ConditionExpression: 'attribute_exists(todoId)',
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': `https://${bucketName}.s3.amazonaws.com/${todoId}`
        }
      })
      .promise();
  }

  async generateUploadUrl(userId: string, todoId: string): Promise<string> {
    const s3 = new AWS.S3({ signatureVersion: 'v4' });
    const signedUrl = s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    });
    await this.saveImgUrl(userId, todoId, this.bucketName);
    return signedUrl
  }
}
