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

import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  ApplyButton,
  CancelButton,
  Content,
  Field,
  InputContainer,
  Label,
  SmallWidthInput,
  Value
} from '@client/views/SysAdmin/Config/Application/Components'
import { InputField } from '@opencrvs/components/lib/forms'
import { IStoreState } from '@client/store'
import {
  FloatingNotification,
  ListViewItemSimplified,
  NOTIFICATION_TYPE,
  ResponsiveModal
} from '@opencrvs/components/lib/interface'
import { BirthActionId } from '@client/views/SysAdmin/Config/Application'
import { useIntl } from 'react-intl'
import { messages } from '@client/i18n/messages/views/config'
import { buttonMessages } from '@client/i18n/messages'
import { getOfflineData } from '@client/offline/selectors'
import { callApplicationConfigMutation } from '@client/views/SysAdmin/Config/Application/utils'
import { LinkButton } from '@opencrvs/components/lib/buttons'
import { isString } from 'lodash'

export function BirthDelayedRegistrationTarget() {
  const intl = useIntl()
  const dispatch = useDispatch()
  const offlineCountryConfiguration = useSelector((store: IStoreState) =>
    getOfflineData(store)
  )
  const [isValueUpdating, setIsValueUpdating] = React.useState(false)
  const [showModal, setShowModal] = React.useState(false)
  const toggleModal = () => setShowModal((prev) => !prev)
  const [notificationStatus, setNotificationStatus] = React.useState<
    'idle' | 'success' | 'error'
  >('idle')
  const birthRegistrationTarget =
    offlineCountryConfiguration.config.BIRTH.REGISTRATION_TARGET
  const [birthLateRegistrationTarget, setBirthLateRegistrationTarget] =
    React.useState(
      String(offlineCountryConfiguration.config.BIRTH.LATE_REGISTRATION_TARGET)
    )

  const handleBirthLateRegistrationTarget = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = String(event.target.value)
    if ((!value.includes('.') && /^\d+$/.test(value)) || !value) {
      setBirthLateRegistrationTarget(value)
    }
  }

  async function lateBirthRegTargetMutationHandler() {
    try {
      await callApplicationConfigMutation(
        BirthActionId.BIRTH_LATE_REGISTRATION_TARGET,
        {
          ...offlineCountryConfiguration.config,
          BIRTH: {
            REGISTRATION_TARGET:
              offlineCountryConfiguration.config.BIRTH.REGISTRATION_TARGET,
            LATE_REGISTRATION_TARGET: parseInt(birthLateRegistrationTarget),
            FEE: {
              ON_TIME: offlineCountryConfiguration.config.BIRTH.FEE.ON_TIME,
              LATE: offlineCountryConfiguration.config.BIRTH.FEE.LATE,
              DELAYED: offlineCountryConfiguration.config.BIRTH.FEE.DELAYED
            }
          }
        },
        offlineCountryConfiguration,
        dispatch,
        setIsValueUpdating
      )
      setNotificationStatus('success')
    } catch {
      setNotificationStatus('error')
    } finally {
      toggleModal()
    }
  }
  const item = {
    label: intl.formatMessage(messages.delayedRegistrationLabel),
    value: intl.formatMessage(messages.delayedRegistrationValue, {
      lateTime:
        offlineCountryConfiguration.config.BIRTH.LATE_REGISTRATION_TARGET
    }),
    action: {
      id: BirthActionId.BIRTH_LATE_REGISTRATION_TARGET,
      label: intl.formatMessage(buttonMessages.change)
    }
  }
  const id = isString(item.label)
    ? item.label.split(' ').join('-')
    : 'label-component'

  return (
    <>
      <ListViewItemSimplified
        label={<Label id={`${id}_label`}>{item.label}</Label>}
        value={<Value id={`${id}_value`}>{item.value}</Value>}
        actions={
          <LinkButton id={item.action.id} onClick={toggleModal}>
            {item.action?.label}
          </LinkButton>
        }
      />
      {showModal && (
        <ResponsiveModal
          id={`${id}Modal`}
          title={intl.formatMessage(messages.birthLegallySpecifiedDialogTitle)}
          autoHeight={true}
          titleHeightAuto={true}
          show={showModal}
          actions={[
            <CancelButton key="cancel" id="modal_cancel" onClick={toggleModal}>
              {intl.formatMessage(buttonMessages.cancel)}
            </CancelButton>,
            <ApplyButton
              key="apply"
              id="apply_change"
              disabled={
                Number(birthLateRegistrationTarget) <
                Number(birthRegistrationTarget) + 2
              }
              onClick={() => {
                lateBirthRegTargetMutationHandler()
              }}
            >
              {intl.formatMessage(buttonMessages.apply)}
            </ApplyButton>
          ]}
          handleClose={toggleModal}
        >
          <Content>
            <Field>
              <InputField
                id="applicationBirthRegTarget"
                touched={true}
                required={false}
              >
                <InputContainer>
                  <SmallWidthInput
                    id="applicationBirthRegTarget"
                    type="text"
                    error={false}
                    defaultValue={
                      offlineCountryConfiguration.config.BIRTH
                        .LATE_REGISTRATION_TARGET
                    }
                    onChange={handleBirthLateRegistrationTarget}
                  />
                  <span>
                    {intl.formatMessage(messages.eventTargetInputLabel)}
                  </span>
                </InputContainer>
              </InputField>
            </Field>
          </Content>
        </ResponsiveModal>
      )}

      <FloatingNotification
        id="print-cert-notification"
        type={
          notificationStatus === 'success'
            ? NOTIFICATION_TYPE.SUCCESS
            : NOTIFICATION_TYPE.ERROR
        }
        show={notificationStatus !== 'idle'}
        callback={() => {
          setNotificationStatus('idle')
        }}
      >
        {notificationStatus === 'success'
          ? intl.formatMessage(
              messages.applicationBirthLateRegTargetChangeNotification
            )
          : intl.formatMessage(messages.applicationConfigChangeError)}
      </FloatingNotification>
    </>
  )
}
