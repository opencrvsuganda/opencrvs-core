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
import { defineMessages, MessageDescriptor } from 'react-intl'
import { DeathSection, BirthSection } from '@client/forms'

interface IFormConfigMessages
  extends Record<string | number | symbol, MessageDescriptor> {
  introduction: MessageDescriptor
  showHiddenFields: MessageDescriptor
  textInput: MessageDescriptor
  textAreaInput: MessageDescriptor
  numberInput: MessageDescriptor
  phoneNumberInput: MessageDescriptor
  heading: MessageDescriptor
  supportingCopy: MessageDescriptor
  addInputContent: MessageDescriptor
  pages: MessageDescriptor
  contentKey: MessageDescriptor
  certificateHandlebars: MessageDescriptor
  hideField: MessageDescriptor
  requiredForRegistration: MessageDescriptor
  settingsTitle: MessageDescriptor
  introductionSettings: MessageDescriptor
  addressesSettings: MessageDescriptor
  enable: MessageDescriptor
  disable: MessageDescriptor
  introductionPageSettingsDialogTitle: MessageDescriptor
  introductionPageSettingsDialogDesc: MessageDescriptor
  addressesSettingsDialogTitle: MessageDescriptor
  addressesSettingsDialogDesc: MessageDescriptor
  showIntroductionPage: MessageDescriptor
  introductionPageSuccessNotification: MessageDescriptor
  noOfAddressesSuccessNotification: MessageDescriptor
}

type INavigationMessages = Record<
  Exclude<BirthSection, 'preview'> | Exclude<DeathSection, 'preview'>,
  MessageDescriptor
>

const navigationMessagesToDefine: INavigationMessages = {
  child: {
    id: 'form.config.navigation.child',
    defaultMessage: 'Child details',
    description: 'Label for children details in page navigation'
  },
  mother: {
    id: 'form.config.navigation.mother',
    defaultMessage: 'Mothers details',
    description: 'Label for mother details in page navigation'
  },
  father: {
    id: 'form.config.navigation.father',
    defaultMessage: 'Fathers details',
    description: 'Label for father details in page navigation'
  },
  informant: {
    id: 'form.config.navigation.informant',
    defaultMessage: 'Informant details',
    description: 'Label for informant details in page navigation'
  },
  documents: {
    id: 'form.config.navigation.documents',
    defaultMessage: 'Documents upload',
    description: 'Label for documents upload in page navigation'
  },
  deceased: {
    id: 'form.config.navigation.deceased',
    defaultMessage: 'Deceased details',
    description: 'Label for deceased details in page navigation'
  },
  deathEvent: {
    id: 'form.config.navigation.deathEvent',
    defaultMessage: 'Event details',
    description: 'Label for event details in page navigation'
  },
  causeOfDeath: {
    id: 'form.config.navigation.causeOfDeath',
    defaultMessage: 'Cause of death',
    description: 'Label for cause of death in page navigation'
  },
  spouse: {
    id: 'form.config.navigation.spouse',
    defaultMessage: 'Spouse details',
    description: 'Label for spouse details in page navigation'
  },
  registration: {
    id: 'form.config.navigation.registration',
    defaultMessage: 'Registration',
    description: 'Label for registration in page navigation'
  },
  primaryCaregiver: {
    id: 'form.config.navigation.primaryCaregiver',
    defaultMessage: 'Primary Caregiver',
    description: 'Label for primaryCaregiver in page navigation'
  }
}

const messagesToDefine: IFormConfigMessages = {
  introduction: {
    id: 'form.config.navigation.information',
    defaultMessage: 'Introduction',
    description: 'Label for Introduction in page navigation'
  },
  pages: {
    id: 'form.config.navigation.pages',
    defaultMessage: 'Pages',
    description: 'Label for Pages in page navigation'
  },
  showHiddenFields: {
    id: 'form.config.tools.showHiddenFields',
    defaultMessage: 'Show hidden fields',
    description: 'Label for Show hidden fields in form tools'
  },
  textInput: {
    id: 'form.config.tools.textInput',
    defaultMessage: 'Text input',
    description: 'Label for Text Input in form tools'
  },
  textAreaInput: {
    id: 'form.config.tools.textAreaInput',
    defaultMessage: 'Text area input',
    description: 'Label for Text area input in form tools'
  },
  numberInput: {
    id: 'form.config.tools.numberInput',
    defaultMessage: 'Number input',
    description: 'Label for Number input in form tools'
  },
  phoneNumberInput: {
    id: 'form.config.tools.phoneNumberInput',
    defaultMessage: 'Phone number input',
    description: 'Label for Phone number input in form tools'
  },
  heading: {
    id: 'form.config.tools.heading',
    defaultMessage: 'Heading',
    description: 'Label for Heading in form tools'
  },
  supportingCopy: {
    id: 'form.config.tools.supportingCopy',
    defaultMessage: 'Supporting copy',
    description: 'Label for Supporting copy in form tools'
  },
  addInputContent: {
    id: 'form.config.tools.addInputContent',
    defaultMessage: 'Add input/content',
    description: 'Label for Add input/content in form tools'
  },
  contentKey: {
    id: 'form.config.formTools.contentKey',
    defaultMessage: 'Content Key',
    description: 'Content key label for formTools'
  },
  certificateHandlebars: {
    id: 'form.config.formTools.certificateHandlebars',
    defaultMessage: 'Certificate handlebars',
    description: 'Certificate handlebars label for formTools'
  },
  hideField: {
    id: 'form.config.formTools.hideField',
    defaultMessage: 'Hide field',
    description: 'Hide field label for formTools'
  },
  requiredForRegistration: {
    id: 'form.config.formTools.requiredForRegistration',
    defaultMessage: 'Required for registration',
    description: 'Required for registration label for formTools'
  },
  settingsTitle: {
    id: 'form.config.settings.title',
    defaultMessage: 'Settings',
    description: 'Title of the settings page'
  },
  introductionSettings: {
    id: 'form.config.introductionSettings',
    defaultMessage: 'Introduction page',
    description: 'Label for introduction page settings'
  },
  addressesSettings: {
    id: 'form.config.addressesSettings',
    defaultMessage: 'No. of addresses',
    description: 'Label for addresses settings'
  },
  enable: {
    id: 'form.config.settings.enable',
    defaultMessage: 'Enabled',
    description: 'Label for enable intorduction page settings'
  },
  disable: {
    id: 'form.config.settings.disable',
    defaultMessage: 'Disabled',
    description: 'Label for disable intorduction page settings'
  },
  introductionPageSettingsDialogTitle: {
    id: 'form.config.settings.introductionPage.dialogTitle',
    defaultMessage: 'Introduction page?',
    description: 'Title for intorduction page settings dialog'
  },
  introductionPageSettingsDialogDesc: {
    id: 'form.config.settings.introductionPage.dialogDesc',
    defaultMessage:
      'An introduction page can be used to describe the registration process to an informant.',
    description: 'Description for intorduction page settings dialog'
  },
  addressesSettingsDialogTitle: {
    id: 'form.config.settings.addresses.dialogTitle',
    defaultMessage: 'No. of addresses?',
    description: 'Title for addresses settings dialog'
  },
  addressesSettingsDialogDesc: {
    id: 'form.config.settings.addresses.dialogDesc',
    defaultMessage:
      'How many address do you want to capture for the parents, informant and deceased?',
    description: 'Description for addresses settings dialog'
  },
  showIntroductionPage: {
    id: 'form.config.settings.showIntroductionPage',
    defaultMessage: 'Show introduction page',
    description: 'Label for introduction page toggle settings'
  },
  introductionPageSuccessNotification: {
    id: 'form.config.settings.introductionPage.successNotification',
    defaultMessage: 'Introduction page has been {action}',
    description: 'Success notification label for introduction page settings'
  },
  noOfAddressesSuccessNotification: {
    id: 'form.config.settings.addresses.successNotification',
    defaultMessage: 'The number of address has been updated',
    description: 'Success notification label for number of addresses settings'
  }
}

export const messages: IFormConfigMessages = defineMessages(messagesToDefine)
export const navigationMessages = defineMessages(navigationMessagesToDefine)
