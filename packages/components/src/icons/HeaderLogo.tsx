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

export const HeaderLogo = (props: React.HTMLAttributes<SVGElement>) => (
  <svg width={109} height={47} fill="none" {...props}>
    <path
      d="M11.483 34.26h89.409l-3.483 2.76H8l3.483-2.76z"
      fill="url(#menu_logo)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.507 16.584c.74-.384 1.556-.584 2.477-.584 1.828 0 3.353.723 4.274 2.43.469.846.71 1.876.71 3.075 0 2.4-1.042 4.152-2.507 4.937-.74.384-1.556.569-2.477.569-1.827 0-3.338-.723-4.29-2.43C8.228 23.735 8 22.705 8 21.505c0-2.399 1.042-4.167 2.507-4.92zm4.607 2.185c-.558-.615-1.268-.923-2.13-.923-.86 0-1.57.308-2.144.923-.559.615-.846 1.522-.846 2.737s.287 2.122.846 2.737c.574.615 1.284.923 2.145.923.86 0 1.57-.308 2.13-.923.573-.615.86-1.522.86-2.737s-.287-2.122-.86-2.737zm8.776 3.906h2.024c2.16 0 3.307-1.308 3.307-3.276 0-1.968-1.148-3.275-3.307-3.275h-3.988v10.764h1.964v-4.213zm0-1.846h1.948c.921 0 1.39-.477 1.39-1.43s-.469-1.43-1.39-1.43H23.89v2.86zm8.941-4.705v10.764h6.691v-1.845h-4.727v-2.584h3.67v-1.845h-3.67v-2.645h4.727v-1.845h-6.69zm16.825 7.119v-7.105h1.964v10.764h-2.07l-3.881-7.104v7.105h-1.964V16.137h2.07l3.881 7.105zm13.613-3.528l1.815-.46c-.512-2.073-2.141-3.255-4.5-3.255-1.443 0-2.654.491-3.647 1.458-.993.968-1.49 2.319-1.49 4.038 0 1.72.497 3.07 1.49 4.037.993.968 2.204 1.459 3.647 1.459 2.359 0 3.988-1.182 4.5-3.255l-1.815-.46c-.481 1.243-1.366 1.873-2.685 1.873-.885 0-1.63-.307-2.22-.937-.573-.63-.868-1.535-.868-2.717 0-1.182.295-2.088.869-2.717.59-.63 1.334-.937 2.219-.937 1.32 0 2.204.63 2.685 1.873zm13.873-.537c0 1.428-.73 2.502-2.033 2.886l3.01 4.805h-2.25l-2.917-4.636h-1.055v4.636h-2.018V16.123h3.958c2.11 0 3.305 1.213 3.305 3.055zm9.761 7.691l3.647-10.746h-2.234l-2.437 7.952-2.436-7.952h-2.235l3.647 10.746h2.048zm13.145-8.92l-1.63 1.03c-.388-.753-.9-1.137-1.505-1.137-.605 0-1.04.415-1.04.983 0 .675.745 1.182 1.63 1.597 1.303.567 3.026 1.366 3.01 3.223 0 2.088-1.365 3.347-3.476 3.347-.946 0-1.769-.292-2.452-.86-.682-.583-1.117-1.305-1.288-2.149l1.63-1.013c.419 1.458 1.133 2.18 2.157 2.18.947 0 1.412-.46 1.412-1.397 0-.63-.698-1.12-1.614-1.505-1.288-.537-2.964-1.35-2.933-3.331 0-.814.28-1.504.838-2.072.574-.569 1.273-.845 2.126-.845 1.474 0 2.514.645 3.135 1.95zm-26.196 2.442h-1.956v-2.426h1.956c.853 0 1.272.4 1.272 1.213 0 .813-.419 1.213-1.272 1.213z"
      fill="#fff"
    />
    <defs>
      <linearGradient
        id="menu_logo"
        x1={36.836}
        y1={37.697}
        x2={36.933}
        y2={34.523}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#4C68C1" />
        <stop offset={1} stopColor="#7C93EC" />
      </linearGradient>
    </defs>
  </svg>
)
