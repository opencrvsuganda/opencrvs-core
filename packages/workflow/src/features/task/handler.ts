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
import * as Hapi from '@hapi/hapi'
import fetch from 'node-fetch'
import { HEARTH_URL } from '@workflow/constants'
import { modifyTaskBundle } from '@workflow/features/task/fhir/fhir-bundle-modifier'
import {
  getEntryId,
  getSharedContactMsisdn
} from '@workflow/features/registration/fhir/fhir-utils'
import { getToken } from '@workflow/utils/authUtils'
import { logger } from '@workflow/logger'
import { sendEventNotification } from '@workflow/features/registration/utils'
import { Events } from '@workflow/features/events/handler'
import {
  filterTaskExtensions,
  getTaskBusinessStatus
} from '@workflow/features/task/fhir/utils'
import {
  DOWNLOADED_EXTENSION_URL,
  REINSTATED_EXTENSION_URL
} from '@workflow/features/task/fhir/constants'

export default async function updateTaskHandler(
  request: Hapi.Request,
  h: Hapi.ResponseToolkit,
  event: Events
) {
  try {
    const payload = await modifyTaskBundle(
      request.payload as fhir.Bundle,
      getToken(request)
    )
    const taskId = getEntryId(payload)
    const taskResource = payload.entry?.[0].resource as fhir.Task
    if (!taskResource) {
      throw new Error('TaskBundle has no entry')
    }
    if (taskResource.extension) {
      taskResource.extension = filterTaskExtensions(
        taskResource.extension,
        [REINSTATED_EXTENSION_URL, DOWNLOADED_EXTENSION_URL],
        getTaskBusinessStatus(taskResource)
      )
    }
    const res = await fetch(`${HEARTH_URL}/Task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskResource),
      headers: {
        'Content-Type': 'application/fhir+json'
      }
    })
    if (!res.ok) {
      throw new Error(
        `FHIR put to /fhir failed with [${
          res.status
        }] body: ${await res.text()}`
      )
    }
    const msisdn = await getSharedContactMsisdn(payload)
    /* sending notification to the contact */
    if (msisdn) {
      logger.info(
        'updateTaskHandler(reject application) sending event notification'
      )
      sendEventNotification(payload, event, msisdn, {
        Authorization: request.headers.authorization
      })
    } else {
      logger.info(
        'updateTaskHandler(reject application) could not send event notification'
      )
    }

    return taskResource
  } catch (error) {
    logger.error(`Workflow/updateTaskHandler: error: ${error}`)
    throw new Error(error)
  }
}
