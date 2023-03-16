import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getTodos } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';
import { getToken } from '../../utils/getJwt';
import { TodoItem } from '../../models/Todo.d';
import { parseLimitParameter, parseNextKeyParameter, parseOrderByParameter } from './utils';

const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('Processing GetTodos event...');
  const jwtToken: string = getToken(event);
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  };

  try {
    let nextKey = parseNextKeyParameter(event);
    let limit = parseLimitParameter(event) || 10;
    let  orderBy = parseOrderByParameter(event) || '';
    const todoList: {
      todoList:TodoItem[],
      nextKey:string
    } = await getTodos(jwtToken,nextKey, limit, orderBy);
    logger.info('Successfully retrieved todolist');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ todoList: todoList.todoList, nextKey: todoList.nextKey,prevKey:nextKey })
    };
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error })
    };
  }
};
