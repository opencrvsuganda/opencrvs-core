import * as Hapi from 'hapi'
import * as Joi from 'joi'
import { authenticate, storeUserInformation } from './service'
import {
  generateVerificationCode,
  sendVerificationCode,
  generateNonce
} from 'src/features/verifyCode/service'
import { logger } from 'src/logger'
import { unauthorized } from 'boom'
import { PRODUCTION } from 'src/constants'

interface IAuthPayload {
  mobile: string
  password: string
}

interface IAuthResponse {
  nonce: string
  mobile: string
}

export default async function authenticateHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit
): Promise<IAuthResponse> {
  const payload = request.payload as IAuthPayload
  let result

  try {
    result = await authenticate(payload.mobile, payload.password)
  } catch (err) {
    throw unauthorized()
  }

  const nonce = generateNonce()
  await storeUserInformation(nonce, result.userId, result.role, result.mobile)

  const verificationCode = await generateVerificationCode(nonce, result.mobile)

  if (!PRODUCTION) {
    logger.info('Sending a verification SMS', {
      mobile: result.mobile,
      verificationCode
    })
  } else {
    await sendVerificationCode(result.mobile, verificationCode)
  }

  return { mobile: result.mobile, nonce }
}

export const requestSchema = Joi.object({
  mobile: Joi.string(),
  password: Joi.string()
})

export const responseSchema = Joi.object({
  nonce: Joi.string(),
  mobile: Joi.string()
})
