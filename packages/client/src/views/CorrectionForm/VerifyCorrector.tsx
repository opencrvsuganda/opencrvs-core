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
import { ActionPageLight } from '@opencrvs/components/lib/interface'
import { modifyApplication, IApplication } from '@client/applications'
import { ReviewSection } from '@client/forms'
import { messages } from '@client/i18n/messages/views/correction'
import { goBack, goToPageGroup, goToHomeTab } from '@client/navigation'
import { IStoreState } from '@client/store'
import {
  IDVerifier,
  ICorrectorInfo
} from '@client/views/CorrectionForm/IDVerifier'
import * as React from 'react'
import { WrappedComponentProps as IntlShapeProps, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { getOfflineData } from '@client/offline/selectors'
import { IOfflineData } from '@client/offline/reducer'
import { CERTIFICATE_CORRECTION_REVIEW } from '@client/navigation/routes'
interface INameField {
  firstNamesField: string
  familyNameField: string
}
interface INameFields {
  [language: string]: INameField
}

export interface ICertificateCorrectorField {
  identifierTypeField: string
  identifierOtherTypeField: string
  identifierField: string
  nameFields: INameFields
  birthDateField: string
  nationalityField: string
}

export interface ICertificateCorrectorDefinition {
  [corrector: string]: ICertificateCorrectorField
}

interface IMatchParams {
  applicationId: string
  corrector: string
}

interface IStateProps {
  application: IApplication
  offlineResources: IOfflineData
}
interface IDispatchProps {
  goBack: typeof goBack
  modifyApplication: typeof modifyApplication
  goToPageGroup: typeof goToPageGroup
  goToHomeTab: typeof goToHomeTab
}

type IOwnProps = RouteComponentProps<IMatchParams>

type IFullProps = IStateProps & IDispatchProps & IOwnProps & IntlShapeProps

class VerifyCorrectorComponent extends React.Component<IFullProps> {
  handleVerification = (hasShowedVerifiedDocument: boolean) => {
    const application = this.props.application
    this.props.modifyApplication({
      ...application,
      data: {
        ...application.data,
        correction: {
          ...application.data.corrector,
          hasShowedVerifiedDocument
        }
      }
    })

    this.props.goToPageGroup(
      CERTIFICATE_CORRECTION_REVIEW,
      this.props.application.id,
      ReviewSection.Review,
      'review-view-group',
      this.props.application.event
    )
  }

  getGenericCorrectorInfo = (corrector: string): ICorrectorInfo => {
    const { intl, application, offlineResources } = this.props
    const info = application.data[corrector]
    //TODO :: we have to get form defination from new certificateCorrectorDefination
    const showInfoFor = ['mother', 'father', 'child', 'informant']
    if (showInfoFor.includes(corrector)) {
      const fields =
        offlineResources.forms.certificateCorrectorDefinition[
          application.event
        ][corrector]
      const iD = info[fields.identifierField] as string
      const iDType = (info[fields.identifierTypeField] ||
        info[fields.identifierOtherTypeField]) as string

      const firstNames = info[
        fields.nameFields[intl.locale].firstNamesField
      ] as string
      const familyName = info[
        fields.nameFields[intl.locale].familyNameField
      ] as string

      const birthDate = info[fields.birthDateField] as string
      const nationality = info[fields.nationalityField] as string

      return {
        iD,
        iDType,
        firstNames,
        familyName,
        birthDate,
        nationality
      }
    } else {
      return {
        iD: '',
        iDType: '',
        firstNames: '',
        familyName: '',
        birthDate: '',
        nationality: ''
      }
    }
  }

  cancelCorrection = () => {
    this.props.modifyApplication({
      ...this.props.application,
      data: {
        ...this.props.application.originalData
      }
    })
    this.props.goToHomeTab('review')
  }

  render() {
    const { corrector } = this.props.match.params
    const { intl } = this.props
    const correctorInfo = this.getGenericCorrectorInfo(corrector)
    const hasNoInfo = Object.values(correctorInfo).every(
      (property) => property === undefined || property === ''
    )

    return (
      <ActionPageLight
        goBack={this.props.goBack}
        goHome={this.cancelCorrection}
        title={intl.formatMessage(messages.title)}
        hideBackground
      >
        {hasNoInfo ? (
          <IDVerifier
            id="idVerifier"
            title={
              hasNoInfo
                ? intl.formatMessage(messages.otherIdCheckTitle)
                : intl.formatMessage(messages.idCheckTitle)
            }
            actionProps={{
              positiveAction: {
                label: intl.formatMessage(messages.idCheckVerify),
                handler: () => {
                  this.handleVerification(false)
                }
              },
              negativeAction: {
                label: intl.formatMessage(messages.idCheckWithoutVerify),
                handler: () => {
                  this.handleVerification(true)
                }
              }
            }}
          />
        ) : (
          <IDVerifier
            id="idVerifier"
            title={intl.formatMessage(messages.idCheckTitle)}
            correctorInformation={correctorInfo}
            actionProps={{
              positiveAction: {
                label: intl.formatMessage(messages.idCheckVerify),
                handler: () => {
                  this.handleVerification(false)
                }
              },
              negativeAction: {
                label: intl.formatMessage(messages.idCheckWithoutVerify),
                handler: () => {
                  this.handleVerification(true)
                }
              }
            }}
          />
        )}
      </ActionPageLight>
    )
  }
}

const mapStateToProps = (
  state: IStoreState,
  ownProps: IOwnProps
): IStateProps => {
  const { applicationId } = ownProps.match.params

  const application = state.applicationsState.applications.find(
    (draft) => draft.id === applicationId
  )

  if (!application) {
    throw new Error(`Draft "${applicationId}" missing!`)
  }

  return {
    application,
    offlineResources: getOfflineData(state)
  }
}

export const VerifyCorrector = connect(mapStateToProps, {
  goBack,
  modifyApplication,
  goToPageGroup,
  goToHomeTab
})(injectIntl(VerifyCorrectorComponent))
