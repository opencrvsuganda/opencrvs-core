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
import gql from 'graphql-tag'

export const REGISTRATION_RATES_METRICS = gql`
  query data(
    $timeStart: String!
    $timeEnd: String!
    $locationId: String!
    $event: String!
  ) {
    fetchRegistrationMetrics(
      timeStart: $timeStart
      timeEnd: $timeEnd
      locationId: $locationId
      event: $event
    ) {
      timeFrames {
        details {
          locationId
          regWithinTargetd
          regWithinTargetdTo1yr
          regWithin1yrTo5yr
          regOver5yr
          total
        }
        total {
          regWithinTargetd
          regWithinTargetdTo1yr
          regWithin1yrTo5yr
          regOver5yr
          total
        }
      }
      genderBasisMetrics {
        details {
          location
          maleUnder18
          femaleUnder18
          maleOver18
          femaleOver18
          total
        }
        total {
          maleUnder18
          femaleUnder18
          maleOver18
          femaleOver18
          total
        }
      }
      estimatedTargetDayMetrics {
        details {
          locationId
          estimatedRegistration
          registrationInTargetDay
          estimationYear
          estimationLocationLevel
          estimationPercentage
        }
        total {
          estimatedRegistration
          registrationInTargetDay
          estimationPercentage
        }
      }
      payments {
        details {
          locationId
          total
        }
        total {
          total
        }
      }
    }
  }
`
export const PERFORMANCE_METRICS_FOR_OFFICE = gql`
  query data($timeStart: String!, $timeEnd: String!, $locationId: String!) {
    getDeclarationsStartedMetrics(
      timeStart: $timeStart
      timeEnd: $timeEnd
      locationId: $locationId
    ) {
      fieldAgentDeclarations
      hospitalDeclarations
      officeDeclarations
    }
  }
`
export const PERFORMANCE_METRICS = gql`
  query data($timeStart: String!, $timeEnd: String!, $locationId: String!) {
    getEventEstimationMetrics(
      timeStart: $timeStart
      timeEnd: $timeEnd
      locationId: $locationId
    ) {
      birthTargetDayMetrics {
        actualRegistration
        estimatedRegistration
        estimatedPercentage
        malePercentage
        femalePercentage
      }
      deathTargetDayMetrics {
        actualRegistration
        estimatedRegistration
        estimatedPercentage
        malePercentage
        femalePercentage
      }
    }

    getDeclarationsStartedMetrics(
      timeStart: $timeStart
      timeEnd: $timeEnd
      locationId: $locationId
    ) {
      fieldAgentDeclarations
      hospitalDeclarations
      officeDeclarations
    }
  }
`
