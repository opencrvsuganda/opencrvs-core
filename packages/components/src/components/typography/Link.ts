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
import styled, { StyledComponentClass } from 'styled-components'

export const Link = styled.a.attrs<{ error?: boolean }>({})`
  width: auto;
  min-height: 44px;
  color: ${({ error, theme }) =>
    error ? theme.colors.error : theme.colors.copy};
  cursor: pointer;
  border: 0;
  text-decoration: underline;
  ${({ theme }) => theme.fonts.bodyStyle};
`
