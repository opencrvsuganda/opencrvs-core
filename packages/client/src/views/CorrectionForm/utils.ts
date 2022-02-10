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
  IFormSectionGroup,
  IFormSectionData,
  IAttachmentValue
} from '@client/forms'
import { IApplication, SUBMISSION_STATUS } from '@client/applications'
import { getValidationErrorsForForm } from '@client/forms/validation'

export function groupHasError(
  group: IFormSectionGroup,
  sectionData: IFormSectionData
) {
  const errors = getValidationErrorsForForm(group.fields, sectionData || {})

  for (const field of group.fields) {
    const fieldErrors = errors[field.name].errors
    const nestedFieldErrors = errors[field.name].nestedFields

    if (fieldErrors.length > 0) {
      return true
    }

    if (field.nestedFields) {
      for (const nestedFields of Object.values(field.nestedFields)) {
        for (const nestedField of nestedFields) {
          if (
            nestedFieldErrors[nestedField.name] &&
            nestedFieldErrors[nestedField.name].length > 0
          ) {
            return true
          }
        }
      }
    }
  }

  return false
}

export function isCorrection(application: IApplication) {
  return application.registrationStatus === SUBMISSION_STATUS.REGISTERED
}

export function updateApplicationRegistrationWithCorrection(
  application: IApplication,
  meta?: { userPrimaryOffice?: string }
): void {
  const correctionValues: Record<string, any> = {}
  const { data } = application

  if (data.corrector && data.corrector.relationship) {
    correctionValues.requester = ((
      data.corrector.relationship as IFormSectionData
    ).value || data.corrector.relationship) as string
  }

  if (data.reason) {
    if (data.reason.type) {
      correctionValues.reason = ((data.reason.type as IFormSectionData).value ||
        data.reason.type) as string
    }

    if (data.reason.additionalComment) {
      correctionValues.note = data.reason.additionalComment
    }
  }

  if (data.supportingDocuments) {
    if (
      typeof data.supportingDocuments.supportDocumentRequiredForCorrection ===
      'boolean'
    ) {
      if (data.supportingDocuments.supportDocumentRequiredForCorrection) {
        correctionValues.hasShowedVerifiedDocument = true
      } else {
        correctionValues.noSupportingDocumentationRequired = true
      }
    }

    if (data.supportingDocuments.uploadDocForLegalProof) {
      correctionValues.data = (
        data.supportingDocuments.uploadDocForLegalProof as IAttachmentValue
      ).data
    }
  }

  if (meta) {
    if (meta.userPrimaryOffice) {
      correctionValues.location = {
        _fhirID: meta.userPrimaryOffice
      }
    }
  }

  data.registration.correction = data.registration.correction
    ? {
        ...(data.registration.correction as IFormSectionData),
        ...correctionValues
      }
    : correctionValues
}
