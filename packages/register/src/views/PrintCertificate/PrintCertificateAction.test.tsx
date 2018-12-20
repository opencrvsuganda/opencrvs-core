import {
  FETCH_BIRTH_REGISTRATION_QUERY,
  PrintCertificateAction
} from './PrintCertificateAction'
import { createTestComponent } from 'src/tests/util'
import { createStore } from 'src/store'
import * as React from 'react'

import { FormFieldGenerator } from 'src/components/form'
import { printCertificateFormSection } from './print-certificate'
import { IInformativeRadioGroupFormField } from 'src/forms'

describe('when user wants to print certificate', async () => {
  const { store } = createStore()
  const mock: () => void = jest.fn()
  const formSection = store.getState().printCertificateForm.printCertificateForm
    .sections[0]

  it('renders fields after successful graphql query', async () => {
    const graphqlMock = [
      {
        request: {
          query: FETCH_BIRTH_REGISTRATION_QUERY,
          variables: { id: 'asdhdqe2472487jsdfsdf' }
        },
        result: {
          data: {
            fetchBirthRegistration: {
              id: '9aa15499-4d2f-48c6-9ced-b0b1b077bbb7',
              mother: {
                name: [
                  {
                    firstNames: 'মা',
                    familyName: 'নাম'
                  },
                  {
                    firstNames: 'Mother',
                    familyName: 'Name'
                  }
                ],
                identifier: [
                  {
                    id: '4564',
                    type: 'NATIONAL_ID'
                  }
                ],
                birthDate: '1960-08-18',
                nationality: ['BGD']
              },
              father: {
                name: [
                  {
                    firstNames: 'পিতা',
                    familyName: 'নাম'
                  },
                  {
                    firstNames: 'Father',
                    familyName: 'Name'
                  }
                ],
                identifier: [
                  {
                    id: '4564',
                    type: 'NATIONAL_ID'
                  }
                ],
                birthDate: '1955-08-18',
                nationality: ['BGD']
              },
              createdAt: '2018-12-07T13:11:49.380Z'
            }
          }
        }
      }
    ]

    const testComponent = createTestComponent(
      <PrintCertificateAction
        backLabel="Back"
        title="Print certificate"
        registrationId="asdhdqe2472487jsdfsdf"
        togglePrintCertificateSection={mock}
        printCertificateFormSection={formSection}
      />,
      store,
      graphqlMock
    )

    // wait for mocked data to load mockedProvider
    await new Promise(resolve => {
      setTimeout(resolve, 0)
    })

    testComponent.component.update()
    const fields = printCertificateFormSection.fields
    ;(fields[1] as IInformativeRadioGroupFormField).information = {
      // @ts-ignore
      name: [
        {
          firstNames: 'মা',
          familyName: 'নাম'
        },
        {
          firstNames: 'Mother',
          familyName: 'Name'
        }
      ],
      // @ts-ignore
      identifier: [
        {
          id: '4564',
          type: 'NATIONAL_ID'
        }
      ],
      birthDate: '1960-08-18',
      nationality: ['BGD']
    }
    ;(fields[2] as IInformativeRadioGroupFormField).information = {
      // @ts-ignore
      name: [
        {
          firstNames: 'পিতা',
          familyName: 'নাম'
        },
        {
          firstNames: 'Father',
          familyName: 'Name'
        }
      ],
      // @ts-ignore
      identifier: [
        {
          id: '4564',
          type: 'NATIONAL_ID'
        }
      ],
      birthDate: '1955-08-18',
      nationality: ['BGD']
    }
    expect(
      testComponent.component.find(FormFieldGenerator).prop('fields')
    ).toEqual(fields)

    testComponent.component.unmount()
  })

  it('renders error message when there is an error in query', async () => {
    const graphqlMock = [
      {
        request: {
          query: FETCH_BIRTH_REGISTRATION_QUERY,
          variables: { id: '12345' }
        },
        result: {
          data: {
            fetchBirthRegistration: {
              id: '9aa15499-4d2f-48c6-9ced-b0b1b077bbb7',
              mother: {
                name: [
                  {
                    firstNames: 'মা',
                    familyName: 'নাম'
                  },
                  {
                    firstNames: 'Mother',
                    familyName: 'Name'
                  }
                ],
                identifier: [
                  {
                    id: '4564',
                    type: 'NATIONAL_ID'
                  }
                ],
                birthDate: '1960-08-18',
                nationality: ['BGD']
              },
              father: {
                name: [
                  {
                    firstNames: 'পিতা',
                    familyName: 'নাম'
                  },
                  {
                    firstNames: 'Father',
                    familyName: 'Name'
                  }
                ],
                identifier: [
                  {
                    id: '4564',
                    type: 'NATIONAL_ID'
                  }
                ],
                birthDate: '1955-08-18',
                nationality: ['BGD']
              },
              createdAt: '2018-12-07T13:11:49.380Z'
            }
          }
        }
      }
    ]

    const testComponent = createTestComponent(
      <PrintCertificateAction
        backLabel="Back"
        title="Print certificate"
        registrationId="asdhdqe2472487jsdfsdf"
        togglePrintCertificateSection={mock}
        printCertificateFormSection={formSection}
      />,
      store,
      graphqlMock
    )

    // wait for mocked data to load mockedProvider
    await new Promise(resolve => {
      setTimeout(resolve, 0)
    })

    testComponent.component.update()

    expect(
      testComponent.component
        .find('#print-certificate-queue-error-text')
        .hostNodes()
    ).toHaveLength(1)

    testComponent.component.unmount()
  })
})
