import * as Hapi from '@hapi/hapi'

import { query, writePoints } from '@metrics/influxdb/client'
import { generateAuditPoint } from '@metrics/features/registration/pointGenerator'
import {
  getPractitionerIdFromBundle,
  getCompositionIdFromCompositionOrTask, getTrackingId, getTask
} from '@metrics/features/registration/fhirUtils'

type UserAuditAction =
  | 'DECLARED'
  | 'REGISTERED'
  | 'REJECTED'
  | 'CORRECTED'
  | 'VALIDATED'

type RawUserAuditDataPoint = {
  practitionerId: number
  action: UserAuditAction
  ipAddress: string
  data: string
  userAgent: string
}

type ParsedUserAuditDataPoint = {
  practitionerId: number
  action: UserAuditAction
  ipAddress: string
  data: Record<string, any>
  userAgent: string
}

type UserAuditDataPointWithComposition<Action> = ParsedUserAuditDataPoint & {
  action: Action
  data: { compositionId: string }
}

type UserAuditDataPoint =
  | UserAuditDataPointWithComposition<'DECLARED'>
  | UserAuditDataPointWithComposition<'REGISTERED'>
  | UserAuditDataPointWithComposition<'REJECTED'>
  | UserAuditDataPointWithComposition<'CORRECTED'>
  | UserAuditDataPointWithComposition<'VALIDATED'>

export async function createUserAuditPointFromFHIR(
  action: UserAuditAction,
  request: Hapi.Request
) {
  const ipAddress = request.headers['x-real-ip'] || request.info.remoteAddress
  const userAgent =
    request.headers['x-real-user-agent'] || request.headers['user-agent']

  const bundle = request.payload as fhir.Bundle

  return writePoints([
    generateAuditPoint(
      getPractitionerIdFromBundle(bundle)!,
      action,
      ipAddress,
      userAgent,
      {
        compositionId: getCompositionIdFromCompositionOrTask(bundle),
        trackingId: getTrackingId(getTask(bundle)!)
      }
    )
  ])
}

export async function getUserAuditEvents(
  practitionerId: string,
  size: number,
  skip: number
): Promise<Array<UserAuditDataPoint>> {
  const results = await query<Array<RawUserAuditDataPoint>>(
    `SELECT * from user_audit_event where practitionerId = $practitionerId limit ${size} offset ${skip}`,
    {
      placeholders: { practitionerId: practitionerId }
    }
  )

  return results.map((row) => ({
    ...row,
    data: row.data ? JSON.parse(row.data) : {}
  }))
}