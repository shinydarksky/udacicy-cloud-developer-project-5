import { APIGatewayProxyEvent } from "aws-lambda";

export function parseLimitParameter(event: APIGatewayProxyEvent): number {
  const limitStr = getQueryParameter(event, 'limit')
  if (!limitStr) {
    return undefined
  }

  const limit = parseInt(limitStr, 10)
  if (limit <= 0) {
    throw new Error('Limit should be positive')
  }

  return limit
}

export function parseOrderByParameter(event: APIGatewayProxyEvent): string {
  const orderByStr = getQueryParameter(event, 'orderBy')
  if (!orderByStr) {
    return undefined
  }

  return orderByStr;
}

export function parseNextKeyParameter(event: APIGatewayProxyEvent): any {
  const nextKeyStr = getQueryParameter(event, 'nextKey')
  if (!nextKeyStr) {
    return undefined
  }

  const uriDecoded = decodeURIComponent(nextKeyStr)
  return JSON.parse(uriDecoded)
}

export function getQueryParameter(event: APIGatewayProxyEvent, name: string): string {
  const queryParams = event.queryStringParameters
  if (!queryParams) {
    return undefined
  }

  return queryParams[name]
}