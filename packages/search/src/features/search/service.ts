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
import { client, ISearchResponse } from '@search/elasticsearch/client'
import { ApiResponse } from '@elastic/elasticsearch'
import {
  IAdvancedSearchParam,
  ISearchQuery,
  SortOrder
} from '@search/features/search/types'
import {
  queryBuilder,
  EMPTY_STRING,
  advancedQueryBuilder
} from '@search/features/search/utils'
import { logger } from '@search/logger'
import { OPENCRVS_INDEX_NAME } from '@search/constants'

export const DEFAULT_SIZE = 10
const DEFAULT_SEARCH_TYPE = 'compositions'

export const searchComposition = async (params: ISearchQuery) => {
  const formattedParams = formatSearchParams(params)
  let response: ApiResponse<ISearchResponse<any>>
  try {
    // NOTE: we are using the destructuring assignment
    response = await client.search(formattedParams, {
      ignore: [404]
    })
  } catch (err) {
    if (err.statusCode === 400) {
      logger.error('Search: bad request')
    } else {
      logger.error('Search error: ', err)
    }
    return undefined
  }
  return response
}

export function formatSearchParams(params: ISearchQuery) {
  const {
    query = EMPTY_STRING,
    trackingId = EMPTY_STRING,
    contactNumber = EMPTY_STRING,
    registrationNumber = EMPTY_STRING,
    event = EMPTY_STRING,
    status,
    type,
    declarationLocationId = EMPTY_STRING,
    declarationLocationHirarchyId = EMPTY_STRING,
    eventLocationId = EMPTY_STRING,
    gender = EMPTY_STRING,
    name = EMPTY_STRING,
    nameCombinations = [],
    createdBy = EMPTY_STRING,
    from = 0,
    size = DEFAULT_SIZE,
    sort = SortOrder.ASC,
    sortColumn = 'dateOfDeclaration'
  } = params

  if (nameCombinations.length === 0 && name !== EMPTY_STRING) {
    nameCombinations.push({
      name,
      fields: 'ALL'
    })
  }

  return {
    index: OPENCRVS_INDEX_NAME,
    type: DEFAULT_SEARCH_TYPE,
    from,
    size,
    body: {
      query: queryBuilder(
        query,
        trackingId,
        contactNumber,
        registrationNumber,
        eventLocationId,
        gender,
        nameCombinations,
        declarationLocationId,
        declarationLocationHirarchyId,
        createdBy,
        { event, status, type }
      ),
      sort: [{ [sortColumn]: sort }]
    }
  }
}

export const advancedSearch = async (params: IAdvancedSearchParam) => {
  const response = await client.search({
    index: OPENCRVS_INDEX_NAME,
    type: 'compositions',
    body: {
      query: advancedQueryBuilder(params)
    }
  })

  if (response.body.hits.total.value > 5) {
    throw new Error('Too many results Please narrow your search')
  }

  return response
}
