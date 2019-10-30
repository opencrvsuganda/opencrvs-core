/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * OpenCRVS is also distributed under the terms of the Civil Registration
 * & Healthcare Disclaimer located at http://opencrvs.org/license.
 *
 * Copyright (C) The OpenCRVS Authors. OpenCRVS and the OpenCRVS
 * graphic logo are (registered/a) trademark(s) of Plan International.
 */
import {
  GQLResolver,
  GQLUserIdentifierInput,
  GQLSignatureInput
} from '@gateway/graphql/schema'
import { fetchFHIR, findExtension } from '@gateway/features/fhir/utils'
import { OPENCRVS_SPECIFICATION_URL } from '@gateway/features/fhir/constants'
import { IAuthHeader } from '@gateway/common-types'

interface IUserModelData {
  _id: string
  username: string
  name: string
  scope?: string[]
  email: string
  mobile: string
  status: string
  role: string
  practitionerId: string
  primaryOfficeId: string
  catchmentAreaIds: string[]
}

export interface IUserPayload
  extends Omit<
    IUserModelData,
    | '_id'
    | 'catchmentAreaIds'
    | 'status'
    | 'practitionerId'
    | 'username'
    | 'name'
  > {
  identifiers: GQLUserIdentifierInput[]
  name: {
    use: string
    family: string
    given: string[]
  }[]
  role: string
  type: string
  signature?: GQLSignatureInput
}

export interface IUserSearchPayload {
  username?: string
  mobile?: string
  status?: string
  role?: string
  primaryOfficeId?: string
  locationId?: string
  count: number
  skip: number
  sortOrder: string
}

async function getPractitionerByOfficeId(
  primaryOfficeId: string,
  authHeader: IAuthHeader
) {
  const roleBundle: fhir.Bundle = await fetchFHIR(
    `/PractitionerRole?location=${primaryOfficeId}&role=LOCAL_REGISTRAR`,
    authHeader
  )

  const practitionerRole =
    roleBundle &&
    roleBundle.entry &&
    roleBundle.entry &&
    roleBundle.entry.length > 0 &&
    (roleBundle.entry[0].resource as fhir.PractitionerRole)

  const roleCode =
    practitionerRole &&
    practitionerRole.code &&
    practitionerRole.code.length > 0 &&
    practitionerRole.code[0].coding &&
    practitionerRole.code[0].coding[0].code

  return {
    practitionerId:
      practitionerRole && practitionerRole.practitioner
        ? practitionerRole.practitioner.reference
        : undefined,
    practitionerRole: roleCode || undefined
  }
}

export const userTypeResolvers: GQLResolver = {
  User: {
    id(userModel: IUserModelData) {
      return userModel._id
    },
    userMgntUserID(userModel: IUserModelData) {
      return userModel._id
    },
    async primaryOffice(userModel: IUserModelData, _, authHeader) {
      return await fetchFHIR(
        `/Location/${userModel.primaryOfficeId}`,
        authHeader
      )
    },
    async catchmentArea(userModel: IUserModelData, _, authHeader) {
      return await Promise.all(
        userModel.catchmentAreaIds.map((areaId: string) => {
          return fetchFHIR(`/Location/${areaId}`, authHeader)
        })
      )
    },
    async localRegistrar(userModel: IUserModelData, _, authHeader) {
      const scope = userModel.scope

      if (!scope) {
        return null
      }

      const { practitionerId, practitionerRole } = !scope.includes('register')
        ? await getPractitionerByOfficeId(userModel.primaryOfficeId, authHeader)
        : {
            practitionerId: `Practitioner/${userModel.practitionerId}`,
            practitionerRole: userModel.role
          }

      if (!practitionerId) {
        return
      }

      const practitioner: fhir.Practitioner = await fetchFHIR(
        `/${practitionerId}`,
        authHeader
      )

      if (!practitioner) {
        return
      }

      const signatureExtension = findExtension(
        `${OPENCRVS_SPECIFICATION_URL}extension/employee-signature`,
        practitioner.extension || []
      )

      const signature = signatureExtension && signatureExtension.valueSignature
      return {
        role: practitionerRole,
        name: practitioner.name,
        signature: signature && {
          type: signature.contentType,
          data: signature.blob
        }
      }
    }
  }
}
