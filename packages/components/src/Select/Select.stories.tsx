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
import { Meta, Story } from '@storybook/react'
import { Select, ISelectProps } from './Select'

export default {
  title: 'Input/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          'Select is used for collecting user selection from a list of options.'
      }
    },
    storyCss: {
      height: '170px'
    }
  }
} as Meta

const Template: Story<ISelectProps> = (args) => <Select {...args} />

export const Default = Template.bind({})
Default.args = {
  options: [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ],
  placeholder: 'Select a flavour'
}
