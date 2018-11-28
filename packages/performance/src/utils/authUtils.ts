import * as queryString from 'querystring'
import * as decode from 'jwt-decode'

export interface IURLParams {
  [key: string]: string | string[] | undefined
}
export interface ITokenPayload {
  subject: string
  exp: string
  algorithm: string
  scope: string[]
}

export const isTokenStillValid = (decoded: ITokenPayload) => {
  return Number(decoded.exp) * 1000 > Date.now()
}

export function getToken(): string {
  return (
    (queryString.parse(window.location.search.replace(/^\?/, ''))
      .token as string) ||
    localStorage.getItem('opencrvs') ||
    ''
  )
}

export function storeToken(token: string) {
  localStorage.setItem('opencrvs', token)
}

export const getTokenPayload = (token: string) => {
  if (!token) {
    return null
  }
  let decoded: ITokenPayload
  try {
    decoded = decode(token)
  } catch (err) {
    return null
  }

  return decoded
}
