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
  getAuthenticated,
  getUserDetails,
  getTokenPayload
} from '@performance/profile/selectors'
import { getInitialState } from '@performance/tests/util'

describe('profileSelectors', () => {
  describe('selectors', () => {
    it('should return authenticated boolean', () => {
      const authenticated = false
      expect(getAuthenticated(getInitialState())).toEqual(authenticated)
    })
    it('should return userDetails', () => {
      const userDetails = null
      expect(getUserDetails(getInitialState())).toEqual(userDetails)
    })
    it('should return tokenPayload', () => {
      const tokenPayload = null
      expect(getTokenPayload(getInitialState())).toEqual(tokenPayload)
    })
  })
})
