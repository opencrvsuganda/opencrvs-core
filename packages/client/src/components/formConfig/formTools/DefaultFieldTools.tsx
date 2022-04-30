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
import React from 'react'
import styled from '@client/styledComponents'
import {
  ListViewSimplified,
  ListViewItemSimplified
} from '@opencrvs/components/lib/interface/ListViewSimplified/ListViewSimplified'
import { Toggle } from '@opencrvs/components/lib/buttons/Toggle'
import { Tooltip } from '@opencrvs/components/lib/icons'
import { messages } from '@client/i18n/messages/views/formConfig'
import { useIntl } from 'react-intl'
import {
  getContentKey,
  getCertificateHandlebar,
  IConfigField,
  getFieldDefinition
} from '@client/forms/configuration/configFields/utils'
import { useSelector } from 'react-redux'
import { IStoreState } from '@client/store'
import { useParams } from 'react-router'
import {
  Event,
  BirthSection,
  DeathSection,
  fieldTypeLabel
} from '@client/forms'
import { getRegisterFormSection } from '@client/forms/register/declaration-selectors'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Title = styled.span`
  ${({ theme }) => theme.fonts.h3}
  text-overflow: ellipsis;
  overflow: hidden;
`

const Subtitle = styled.span`
  ${({ theme }) => theme.fonts.bold14}
  display: flex;
  align-items: center;
  gap: 4px;
`

const Label = styled.span`
  ${({ theme }) => theme.fonts.reg14}
  color: ${({ theme }) => theme.colors.grey600};
  display: flex;
  align-items: center;
  gap: 4px;
`

const CenteredToggle = styled(Toggle)`
  align-self: center;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledTooltip = styled(Tooltip)`
  height: 16px;
  width: 16px;
`

const HandleBar = styled.div`
  display: flex;
  flex-direction: column;
`

const Body = styled.span`
  ${({ theme }) => theme.fonts.reg14}
  color: ${({ theme }) => theme.colors.grey500};
`

export function DefaultFieldTools({
  configField
}: {
  configField: IConfigField
}) {
  const intl = useIntl()
  const { event, section } =
    useParams<{ event: Event; section: BirthSection | DeathSection }>()
  const formSection = useSelector((store: IStoreState) =>
    getRegisterFormSection(store, section, event)
  )
  const formField = getFieldDefinition(formSection, configField)
  const handleBar = getCertificateHandlebar(formField)
  const contentKey = getContentKey(formField)
  const fieldLabel = fieldTypeLabel(formField.type)

  return (
    <Container>
      <Title>{intl.formatMessage(fieldLabel)}</Title>
      <ListViewSimplified bottomBorder>
        <ListViewItemSimplified
          label={<Label>{intl.formatMessage(messages.hideField)}</Label>}
          actions={[<CenteredToggle key="hideField" />]}
        />
        <ListViewItemSimplified
          label={
            <Label>
              {intl.formatMessage(messages.requiredForRegistration)}
              <StyledTooltip />
            </Label>
          }
          actions={[
            <CenteredToggle
              key="requiredForRegistration"
              selected={configField.required}
            />
          ]}
        />
      </ListViewSimplified>
      <Content>
        <Subtitle>
          {intl.formatMessage(messages.contentKey)}
          <StyledTooltip />
        </Subtitle>
        <Body>{contentKey}</Body>
      </Content>
      {handleBar && (
        <HandleBar>
          <Subtitle>
            {intl.formatMessage(messages.certificateHandlebars)}
            <StyledTooltip />
          </Subtitle>
          <Body>{`{{ ${handleBar} }}`}</Body>
        </HandleBar>
      )}
    </Container>
  )
}
