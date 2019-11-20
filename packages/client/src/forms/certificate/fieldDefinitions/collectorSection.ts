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
import { RadioSize } from '@opencrvs/components/lib/forms'
import {
  IFormSection,
  RADIO_GROUP,
  SELECT_WITH_OPTIONS,
  TEXT,
  PARAGRAPH,
  CHECKBOX_GROUP,
  IFormSectionGroup,
  SIMPLE_DOCUMENT_UPLOADER,
  FIELD_WITH_DYNAMIC_DEFINITIONS,
  CertificateSection
} from '@client/forms'
import {
  birthIdentityOptions,
  deathIdentityOptions,
  identityNameMapper,
  identityTooltipMapper,
  identityTypeMapper
} from '@client/forms/identity'
import { conditionals } from '@client/forms/utils'
import { formMessages } from '@client/i18n/messages'
import { messages as certificateMessages } from '@client/i18n/messages/views/certificate'
import { validIDNumber } from '@client/utils/validate'

export const certCollectorGroupForBirthAppWithFatherDetails: IFormSectionGroup = {
  id: 'certCollector',
  title: certificateMessages.whoToCollect,
  error: certificateMessages.certificateCollectorError,
  fields: [
    {
      name: 'type',
      type: RADIO_GROUP,
      size: RadioSize.LARGE,
      label: certificateMessages.whoToCollect,
      required: true,
      initialValue: '',
      validate: [],
      options: [
        { value: 'MOTHER', label: formMessages.contactDetailsMother },
        { value: 'FATHER', label: formMessages.contactDetailsFather },
        { value: 'OTHER', label: formMessages.someoneElse }
      ]
    }
  ]
}

export const certCollectorGroupForBirthAppWithoutFatherDetails: IFormSectionGroup = {
  id: 'certCollector',
  title: certificateMessages.whoToCollect,
  error: certificateMessages.certificateCollectorError,
  fields: [
    {
      name: 'type',
      type: RADIO_GROUP,
      size: RadioSize.LARGE,
      label: certificateMessages.whoToCollect,
      required: true,
      initialValue: '',
      validate: [],
      options: [
        { value: 'MOTHER', label: formMessages.contactDetailsMother },
        { value: 'OTHER', label: formMessages.someoneElse }
      ]
    }
  ]
}

export const collectBirthCertificateFormSection: IFormSection = {
  id: CertificateSection.Collector,
  viewType: 'form',
  name: certificateMessages.printCertificate,
  title: certificateMessages.certificateCollectionTitle,
  groups: [
    {
      id: 'otherCertCollector',
      conditionals: [conditionals.certCollectorOther],
      title: certificateMessages.otherCollectorFormTitle,
      error: certificateMessages.certificateOtherCollectorInfoError,
      fields: [
        {
          name: 'paragraph',
          type: PARAGRAPH,
          label: certificateMessages.otherCollectorFormParagraph,
          initialValue: '',
          validate: []
        },
        {
          name: 'iDType',
          type: SELECT_WITH_OPTIONS,
          label: formMessages.typeOfId,
          required: true,
          initialValue: '',
          validate: [],
          placeholder: formMessages.select,
          options: birthIdentityOptions
        },
        {
          name: 'iDTypeOther',
          type: TEXT,
          label: formMessages.iDTypeOtherLabel,
          toolTip: formMessages.tooltipNationalID,
          required: true,
          initialValue: '',
          validate: [],
          conditionals: [conditionals.iDType]
        },
        {
          name: 'iD',
          type: FIELD_WITH_DYNAMIC_DEFINITIONS,
          dynamicDefinitions: {
            label: {
              dependency: 'iDType',
              labelMapper: identityNameMapper
            },
            toolTip: {
              dependency: 'iDType',
              toolTipMapper: identityTooltipMapper
            },
            type: {
              kind: 'dynamic',
              dependency: 'iDType',
              typeMapper: identityTypeMapper
            },
            validate: [
              {
                validator: validIDNumber,
                dependencies: ['iDType']
              }
            ]
          },
          label: formMessages.iD,
          required: true,
          initialValue: '',
          validate: []
        },
        {
          name: 'firstName',
          type: TEXT,
          label: formMessages.firstName,
          required: true,
          initialValue: '',
          validate: []
        },
        {
          name: 'lastName',
          type: TEXT,
          label: formMessages.lastName,
          required: true,
          initialValue: '',
          validate: []
        },
        {
          name: 'relationship',
          type: TEXT,
          label: formMessages.applicantsRelationWithChild,
          required: true,
          initialValue: '',
          validate: []
        }
      ]
    },
    {
      id: 'affidavit',
      conditionals: [conditionals.certCollectorOther],
      title: certificateMessages.certificateOtherCollectorAffidavitFormTitle,
      error: certificateMessages.certificateOtherCollectorAffidavitError,
      fields: [
        {
          name: 'paragraph',
          type: PARAGRAPH,
          label:
            certificateMessages.certificateOtherCollectorAffidavitFormParagraph,
          initialValue: '',
          validate: []
        },
        {
          name: 'affidavitFile',
          type: SIMPLE_DOCUMENT_UPLOADER,
          label: certificateMessages.signedAffidavitFileLabel,
          description: certificateMessages.noLabel,
          initialValue: '',
          required: false,
          validate: []
        },
        {
          name: 'noAffidavitAgreement',
          type: CHECKBOX_GROUP,
          label: certificateMessages.noLabel,
          initialValue: [],
          validate: [],
          required: false,
          options: [
            {
              value: 'AFFIDAVIT',
              label: certificateMessages.noSignedAffidavitAvailable
            }
          ]
        }
      ]
    }
  ]
}

export const collectDeathCertificateFormSection: IFormSection = {
  id: CertificateSection.Collector,
  viewType: 'form',
  name: certificateMessages.printCertificate,
  title: certificateMessages.certificateCollectionTitle,
  groups: [
    {
      id: 'certCollector',
      title: certificateMessages.whoToCollect,
      error: certificateMessages.certificateCollectorError,
      fields: [
        {
          name: 'type',
          type: RADIO_GROUP,
          size: RadioSize.LARGE,
          label: certificateMessages.whoToCollect,
          required: true,
          initialValue: true,
          validate: [],
          options: [
            { value: 'INFORMANT', label: formMessages.applicantName },
            { value: 'OTHER', label: formMessages.someoneElse }
          ]
        }
      ]
    },
    {
      id: 'otherCertCollector',
      conditionals: [conditionals.certCollectorOther],
      title: certificateMessages.otherCollectorFormTitle,
      error: certificateMessages.certificateOtherCollectorInfoError,
      fields: [
        {
          name: 'paragraph',
          type: PARAGRAPH,
          label: certificateMessages.otherCollectorFormParagraph,
          initialValue: '',
          validate: []
        },
        {
          name: 'iDType',
          type: SELECT_WITH_OPTIONS,
          label: formMessages.typeOfId,
          required: true,
          initialValue: '',
          validate: [],
          placeholder: formMessages.select,
          options: deathIdentityOptions
        },
        {
          name: 'iDTypeOther',
          type: TEXT,
          label: formMessages.iDTypeOtherLabel,
          required: true,
          initialValue: '',
          validate: [],
          conditionals: [conditionals.iDType]
        },
        {
          name: 'iD',
          type: FIELD_WITH_DYNAMIC_DEFINITIONS,
          dynamicDefinitions: {
            label: {
              dependency: 'iDType',
              labelMapper: identityNameMapper
            },
            type: {
              kind: 'dynamic',
              dependency: 'iDType',
              typeMapper: identityTypeMapper
            },
            validate: [
              {
                validator: validIDNumber,
                dependencies: ['iDType']
              }
            ]
          },
          label: formMessages.iD,
          required: true,
          initialValue: '',
          validate: []
        },
        {
          name: 'firstName',
          type: TEXT,
          label: formMessages.firstName,
          required: true,
          initialValue: '',
          validate: []
        },
        {
          name: 'lastName',
          type: TEXT,
          label: formMessages.lastName,
          required: true,
          initialValue: '',
          validate: []
        },
        {
          name: 'relationship',
          type: TEXT,
          label: formMessages.applicantsRelationWithDeceased,
          required: true,
          initialValue: '',
          validate: []
        }
      ]
    },
    {
      id: 'affidavit',
      conditionals: [conditionals.certCollectorOther],
      title: certificateMessages.certificateOtherCollectorAffidavitFormTitle,
      error: certificateMessages.certificateOtherCollectorAffidavitError,
      fields: [
        {
          name: 'paragraph',
          type: PARAGRAPH,
          label:
            certificateMessages.certificateOtherCollectorAffidavitFormParagraph,
          initialValue: '',
          validate: []
        },
        {
          name: 'affidavitFile',
          type: SIMPLE_DOCUMENT_UPLOADER,
          label: certificateMessages.signedAffidavitFileLabel,
          description: certificateMessages.noLabel,
          initialValue: '',
          required: false,
          validate: []
        },
        {
          name: 'noAffidavitAgreement',
          type: CHECKBOX_GROUP,
          label: certificateMessages.noLabel,
          required: false,
          initialValue: [],
          validate: [],
          options: [
            {
              value: 'AFFIDAVIT',
              label: certificateMessages.noSignedAffidavitAvailable
            }
          ]
        }
      ]
    }
  ]
}
