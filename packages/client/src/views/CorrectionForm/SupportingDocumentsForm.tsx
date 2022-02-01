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
import { PrimaryButton } from '@opencrvs/components/lib/buttons'
import { ActionPageLight } from '@opencrvs/components/lib/interface'
import { modifyApplication, IApplication } from '@client/applications'
import { FormFieldGenerator } from '@client/components/form'
import { IFormSection, IFormSectionData } from '@client/forms'
import { buttonMessages } from '@client/i18n/messages'
import { messages } from '@client/i18n/messages/views/correction'
import { goBack, goToHomeTab } from '@client/navigation'
import * as React from 'react'
import { WrappedComponentProps as IntlShapeProps, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { supportingDocumentsSection } from '@client/forms/correction/supportDocument'
import { Content } from '@opencrvs/components/lib/interface/Content'

enum ContentSize {
  NORMAL = 'normal',
  LARGE = 'large'
}

type IProps = {
  application: IApplication
}

type IDispatchProps = {
  goBack: typeof goBack
  goToHomeTab: typeof goToHomeTab
  modifyApplication: typeof modifyApplication
}

type IFullProps = IProps & IDispatchProps & IntlShapeProps

function SupportingDocumentsFormComoponent(props: IFullProps) {
  const [hasUploadDocOrSelectOption, setHasUploadDocOrSelectOption] =
    React.useState(false)
  const { intl, application } = props

  const section = supportingDocumentsSection
  const group = section.groups[0]
  if (
    application.data[section.id] &&
    application.data[section.id].uploadDocForLegalProof
  ) {
    group.fields[1].disabled = true
  }

  const contentProps = {
    title: intl.formatMessage(messages.supportingDocumentsTitle),
    subtitle: intl.formatMessage(messages.supportingDocumentsSubtitle),
    size: ContentSize.LARGE
  }

  const modifyApplication = (
    sectionData: IFormSectionData,
    activeSection: IFormSection,
    application: IApplication
  ) => {
    props.modifyApplication({
      ...application,
      data: {
        ...application.data,
        [activeSection.id]: {
          ...application.data[activeSection.id],
          ...sectionData
        }
      }
    })
  }

  const cancelCorrection = () => {
    props.modifyApplication({
      ...application,
      data: {
        ...application.originalData
      }
    })
    props.goToHomeTab('review')
  }
  /*
   * TODO: go to next form
   */
  const continueButtonHandler = () => {}

  return (
    <>
      <ActionPageLight
        id="corrector_form"
        title={intl.formatMessage(section.title)}
        hideBackground
        goBack={props.goBack}
        goHome={cancelCorrection}
      >
        <Content
          {...contentProps}
          bottomActionButtons={[
            <PrimaryButton
              id="confirm_form"
              key="confirm_form"
              disabled={!hasUploadDocOrSelectOption}
              onClick={continueButtonHandler}
            >
              {intl.formatMessage(buttonMessages.continueButton)}
            </PrimaryButton>
          ]}
        >
          <FormFieldGenerator
            id={group.id}
            onChange={(values) => {
              if (
                (values &&
                  values.supportDocumentRequiredForCorrection !== undefined) ||
                values.uploadDocForLegalProof !== undefined
              ) {
                setHasUploadDocOrSelectOption(true)
              }
              modifyApplication(values, section, application)
            }}
            setAllFieldsDirty={false}
            fields={group.fields}
            draftData={application.data}
          />
        </Content>
      </ActionPageLight>
    </>
  )
}

export const SupportingDocumentsForm = connect(undefined, {
  goBack,
  goToHomeTab,
  modifyApplication
})(injectIntl(SupportingDocumentsFormComoponent))
