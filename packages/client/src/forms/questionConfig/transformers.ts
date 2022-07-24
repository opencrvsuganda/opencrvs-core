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
import { getConfigFieldIdentifiers } from '@client/forms/configuration/formConfig/utils'
import {
  IDefaultQuestionConfig,
  ICustomQuestionConfig,
  IFieldIdentifiers,
  getFieldIdentifiers,
  IQuestionConfig
} from '.'
import { ISerializedForm } from '@client/forms'
import {
  getField,
  getFieldId,
  getPrecedingDefaultFieldIdAcrossGroups
} from '@client/forms/configuration/defaultUtils'
import { Event, QuestionInput } from '@client/utils/gateway'
import { populateRegisterFormsWithAddresses } from '@client/forms/configuration/administrative/addresses'
import { registerForms } from '@client/forms/configuration/default'

export function fieldIdentifiersToQuestionConfig(
  event: Event,
  defaultForm: ISerializedForm,
  identifiers: IFieldIdentifiers
): IDefaultQuestionConfig {
  const { required } = getField(identifiers, defaultForm)
  return {
    fieldId: getFieldId(event, identifiers, defaultForm),
    enabled: '',
    required,
    identifiers,
    precedingFieldId: getPrecedingDefaultFieldIdAcrossGroups(
      event,
      identifiers,
      defaultForm
    )
  }
}

/* TODO: The paylaod needs to be validated */
export function questionsTransformer(
  questionsPayload: QuestionInput[]
): IQuestionConfig[] {
  const defaultForms = {
    birth: populateRegisterFormsWithAddresses(
      registerForms[Event.Birth],
      Event.Birth
    ),
    death: populateRegisterFormsWithAddresses(
      registerForms[Event.Death],
      Event.Death
    )
  }
  return questionsPayload.map(
    ({
      fieldId,
      label,
      placeholder,
      description,
      tooltip,
      errorMessage,
      maxLength,
      fieldName,
      fieldType,
      precedingFieldId,
      required,
      enabled,
      custom
    }) => {
      if (custom) {
        return {
          fieldId,
          label,
          placeholder,
          description,
          tooltip,
          errorMessage,
          maxLength,
          fieldName,
          fieldType,
          precedingFieldId,
          required: required ?? false,
          custom
        } as ICustomQuestionConfig
      }

      const { event } = getConfigFieldIdentifiers(fieldId)

      const defaultQuestionConfig: IDefaultQuestionConfig = {
        fieldId,
        enabled: enabled ?? '',
        precedingFieldId,
        identifiers: getFieldIdentifiers(fieldId, defaultForms[event])
      }
      if (required) {
        defaultQuestionConfig.required = required
      }
      return defaultQuestionConfig
    }
  )
}
