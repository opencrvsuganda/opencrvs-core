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
import styled from 'styled-components'
export interface INavigationItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: () => React.ReactNode
  label: string
  count?: number
  isSelected?: boolean
  expandableIcon?: () => React.ReactNode
  isSubItem?: boolean
  children?: React.ReactNode
}

const ItemContainer = styled.button<{ isSelected?: boolean }>`
  width: 100%;
  height: 40px;
  cursor: pointer;
  padding: 0px 0px;
  border: 0;
  outline: none;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.white : theme.colors.white};
  :hover {
    background-color: ${({ theme }) => theme.colors.greyHover};
  }
`
// focus state should show on keyboard navigation.
// :focus {
//   box-shadow: inset 0px 0px 0px 2px ${({ theme }) => theme.colors.focus};
// }

const ItemContentContainer = styled.div<{ isSelected?: boolean }>`
  display: flex;
  flex-flow: row;
  padding: 10px 19px 10px 22px;
`
// refactor icons to be 24x24px. so they have a bounding box. so this function is not required.
const IconContainer = styled.span`
  margin-top: 1px;
`
// padding: 2px 0px;
// width: 12px;

const LabelContainer = styled.span<{
  isSelected?: boolean
  isSubItem?: boolean
}>`
  ${({ theme }) => theme.fonts.subtitleStyle};
  margin-left: 12px;
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.copy : theme.colors.grey700};
`

const ValueContainer = styled.span<{ isSelected?: boolean }>`
  margin-left: auto;
  ${({ theme }) => theme.fonts.captionBolder};
  color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.copy : theme.colors.grey700};
`

export const NavigationItem = ({
  icon,
  label,
  count,
  isSelected,
  expandableIcon,
  isSubItem,
  children,
  ...otherProps
}: INavigationItemProps) => {
  return (
    <ItemContainer isSelected={isSelected} {...otherProps}>
      <ItemContentContainer>
        <IconContainer>{icon && icon()}</IconContainer>
        <LabelContainer isSelected={isSelected} isSubItem={isSubItem}>
          {label}
        </LabelContainer>
        <ValueContainer isSelected={isSelected}>
          {count && count !== 0 ? count : expandableIcon && expandableIcon()}
        </ValueContainer>
      </ItemContentContainer>
      {isSelected && children}
    </ItemContainer>
  )
}
