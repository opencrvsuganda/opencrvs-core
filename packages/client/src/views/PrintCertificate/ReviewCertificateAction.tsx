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
  PrimaryButton,
  SuccessButton,
  DangerButton,
  TertiaryButton
} from '@opencrvs/components/lib/buttons'
import { Check } from '@opencrvs/components/lib/icons'
import { Content } from '@opencrvs/components/lib/interface/Content'

import {
  ResponsiveModal,
  ActionPageLight
} from '@opencrvs/components/lib/interface'
import {
  IPrintableDeclaration,
  modifyDeclaration,
  writeDeclaration,
  storeDeclaration,
  SUBMISSION_STATUS
} from '@opencrvs/client/src/declarations'
import { SubmissionAction, CorrectionSection } from '@client/forms'
import { Event } from '@client/utils/gateway'
import { constantsMessages } from '@client/i18n/messages'
import { buttonMessages } from '@client/i18n/messages/buttons'
import { messages as certificateMessages } from '@client/i18n/messages/views/certificate'
import {
  goToHomeTab,
  goToHomeFromCorrectionTab,
  goBack,
  goToCertificateCorrection
} from '@client/navigation'
import { IStoreState } from '@client/store'
import styled from '@client/styledComponents'
import * as React from 'react'
import { WrappedComponentProps as IntlShapeProps, injectIntl } from 'react-intl'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { getUserDetails, getScope } from '@client/profile/profileSelectors'
import {
  previewCertificate,
  printCertificate
} from '@client/views/PrintCertificate/PDFUtils'
import { getEventRegisterForm } from '@client/forms/register/declaration-selectors'
import {
  getCountryTranslations,
  isCertificateForPrintInAdvance,
  getEventDate,
  isFreeOfCost,
  calculatePrice,
  getRegisteredDate,
  getRegistrarSignatureHandlebarName
} from './utils'
import { getOfflineData } from '@client/offline/selectors'
import { countries } from '@client/forms/countries'
import { PDFViewer } from '@opencrvs/components/lib/forms'
import { WORKQUEUE_TABS } from '@client/components/interface/Navigation'
import { hasRegisterScope } from '@client/utils/authUtils'

const CustomTertiaryButton = styled(TertiaryButton)`
  height: 48px;
  &:disabled {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.grey300};
  }
`
const ButtonWrapper = styled.div`
  display: flex;

  button {
    margin-right: 10px;
  }
  button:last-child {
    margin-right: 0px;
  }
`
const PdfWrapper = styled.div`
  display: flex;
  margin-top: 24px;
  margin-bottom: 56px;
  height: 100%;
  align-items: center;
  justify-content: center;
`

type State = {
  certificatePdf: string | null
  showConfirmationModal: boolean
}

type IFullProps = IntlShapeProps &
  RouteComponentProps<{}, {}, { isNavigatedInsideApp: boolean }> &
  ReturnType<typeof mapStatetoProps> &
  typeof mapDispatchToProps

class ReviewCertificateActionComponent extends React.Component<
  IFullProps,
  State
> {
  componentRef: React.RefObject<HTMLImageElement>
  constructor(props: IFullProps) {
    super(props)
    this.componentRef = React.createRef()
    this.state = {
      certificatePdf: null,
      showConfirmationModal: false
    }
  }
  componentDidMount() {
    if (this.state.certificatePdf === null) {
      previewCertificate(
        this.props.intl,
        this.props.draft,
        this.props.userDetails,
        this.props.offlineCountryConfig,
        (svg: string) => {
          this.setState({
            certificatePdf: svg
          })
        },
        this.props.countries
      )
    }
  }

  toggleModal = () => {
    this.setState({
      showConfirmationModal: !this.state.showConfirmationModal
    })
  }

  readyToCertify = () => {
    const { draft } = this.props
    draft.submissionStatus = SUBMISSION_STATUS.READY_TO_CERTIFY
    draft.action = SubmissionAction.COLLECT_CERTIFICATE

    const registeredDate = getRegisteredDate(draft.data)
    const certificate = draft.data.registration.certificates[0]
    const eventDate = getEventDate(draft.data, draft.event)
    let submittableCertificate
    if (isCertificateForPrintInAdvance(draft)) {
      const paymentAmount = calculatePrice(
        draft.event,
        eventDate,
        registeredDate,
        this.props.offlineCountryConfig
      )
      submittableCertificate = {
        payments: {
          type: 'MANUAL' as const,
          total: Number(paymentAmount),
          amount: Number(paymentAmount),
          outcome: 'COMPLETED' as const,
          date: Date.now()
        }
      }
    } else {
      if (
        isFreeOfCost(
          draft.event,
          eventDate,
          registeredDate,
          this.props.offlineCountryConfig
        )
      ) {
        certificate.payments = {
          type: 'MANUAL' as const,
          total: 0,
          amount: 0,
          outcome: 'COMPLETED' as const,
          date: Date.now()
        }
      }
      submittableCertificate = certificate
    }
    draft.data.registration = {
      ...draft.data.registration,
      certificates: [
        {
          ...submittableCertificate,
          data:
            this.state.certificatePdf === null ? '' : this.state.certificatePdf
        }
      ]
    }

    printCertificate(
      this.props.intl,
      draft,
      this.props.userDetails,
      this.props.offlineCountryConfig,
      this.props.countries
    )
    this.props.modifyDeclaration(draft)
    this.props.writeDeclaration(draft)
    this.toggleModal()
    this.props.goToHomeFromCorrectionTab(WORKQUEUE_TABS.readyToPrint)
  }

  getTitle = () => {
    const { intl, event } = this.props
    let eventName = intl.formatMessage(constantsMessages.birth).toLowerCase()
    switch (event) {
      case Event.Birth:
        return intl.formatMessage(certificateMessages.reviewTitle, {
          event: eventName
        })
      case Event.Death:
        eventName = intl.formatMessage(constantsMessages.death).toLowerCase()
        return intl.formatMessage(certificateMessages.reviewTitle, {
          event: eventName
        })
      default:
        return intl.formatMessage(certificateMessages.reviewTitle, {
          event: eventName
        })
    }
  }

  goBack = () => {
    const historyState = this.props.location.state
    const navigatedFromInsideApp = Boolean(
      historyState && historyState.isNavigatedInsideApp
    )

    if (navigatedFromInsideApp) {
      this.props.goBack()
    } else {
      this.props.goToHomeTab(WORKQUEUE_TABS.readyToPrint)
    }
  }

  render = () => {
    const { intl, scope } = this.props

    return (
      <ActionPageLight
        id="collector_form"
        hideBackground
        title={intl.formatMessage(
          certificateMessages.certificateCollectionTitle
        )}
        goBack={this.goBack}
        goHome={() => this.props.goToHomeTab(WORKQUEUE_TABS.readyToPrint)}
      >
        <Content
          title={this.getTitle()}
          subtitle={intl.formatMessage(certificateMessages.reviewDescription)}
        >
          <ButtonWrapper>
            <SuccessButton
              align={0}
              id="confirm-print"
              onClick={this.toggleModal}
              icon={() => <Check />}
            >
              {intl.formatMessage(certificateMessages.confirmAndPrint)}
            </SuccessButton>
            {hasRegisterScope(scope) && (
              <DangerButton
                onClick={() =>
                  this.props.goToCertificateCorrection(
                    this.props.registrationId,
                    CorrectionSection.Corrector
                  )
                }
              >
                {intl.formatMessage(buttonMessages.editRecord)}
              </DangerButton>
            )}
          </ButtonWrapper>
        </Content>
        {this.state.certificatePdf && (
          <PdfWrapper id="pdfwrapper">
            <PDFViewer id="pdfholder" pdfSource={this.state.certificatePdf} />
          </PdfWrapper>
        )}

        <ResponsiveModal
          id="confirm-print-modal"
          title={intl.formatMessage(certificateMessages.modalTitle)}
          actions={[
            <CustomTertiaryButton onClick={this.toggleModal} id="close-modal">
              {intl.formatMessage(buttonMessages.cancel)}
            </CustomTertiaryButton>,
            <PrimaryButton onClick={this.readyToCertify} id="print-certificate">
              {intl.formatMessage(buttonMessages.print)}
            </PrimaryButton>
          ]}
          show={this.state.showConfirmationModal}
          handleClose={this.toggleModal}
          contentHeight={100}
        >
          {intl.formatMessage(certificateMessages.modalBody)}
        </ResponsiveModal>
      </ActionPageLight>
    )
  }
}

const getEvent = (eventType: string | undefined) => {
  switch (eventType && eventType.toLowerCase()) {
    case 'birth':
    default:
      return Event.Birth
    case 'death':
      return Event.Death
  }
}

const getDraft = (
  drafts: IPrintableDeclaration[],
  registrationId: string,
  eventType: string
) =>
  drafts.find((draftItem) => draftItem.id === registrationId) ||
  ({
    id: '',
    data: {},
    event: getEvent(eventType)
  } as IPrintableDeclaration)

function mapStatetoProps(
  state: IStoreState,
  props: RouteComponentProps<{ registrationId: string; eventType: string }>
) {
  const { registrationId, eventType } = props.match.params
  const declarations = state.declarationsState
    .declarations as IPrintableDeclaration[]

  const draft = getDraft(declarations, registrationId, eventType)
  const event = getEvent(draft.event)
  const offlineCountryConfig = getOfflineData(state)
  const signatureKey = getRegistrarSignatureHandlebarName(
    offlineCountryConfig,
    event
  )

  return {
    event,
    registrationId,
    draft: {
      ...draft,
      data: {
        ...draft.data,
        template: {
          ...draft.data.template,
          [signatureKey]:
            !draft.data.template?.[signatureKey] ||
            isCertificateForPrintInAdvance(draft)
              ? ''
              : draft.data.template[signatureKey]
        }
      }
    },
    scope: getScope(state),
    countries: getCountryTranslations(state.i18n.languages, countries),
    userDetails: getUserDetails(state),
    offlineCountryConfig,
    registerForm: getEventRegisterForm(state, event)
  }
}

const mapDispatchToProps = {
  modifyDeclaration,
  writeDeclaration,
  goToHomeTab,
  goToHomeFromCorrectionTab,
  storeDeclaration,
  goBack,
  goToCertificateCorrection
}

export const ReviewCertificateAction = connect(
  mapStatetoProps,
  mapDispatchToProps
)(injectIntl(ReviewCertificateActionComponent))
