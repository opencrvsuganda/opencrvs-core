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
import { messages } from '@client/i18n/messages/views/userSetup'
import { withTheme } from '@client/styledComponents'
import * as React from 'react'
import Bowser from 'bowser'
import { goToDeclarationRecordAudit } from '@client/navigation'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { Query } from '@client/components/Query'
import { GET_USER_AUDIT_LOG } from '@client/user/queries'
import { connect } from 'react-redux'

import {
  GQLUserAuditLogItemWithComposition,
  GQLUserAuditLogResultItem,
  GQLUserAuditLogResultSet
} from '@opencrvs/gateway/src/graphql/schema'
import {
  ArrowDownBlue,
  StatusCollected,
  StatusGray,
  StatusGreen,
  StatusOrange,
  StatusProgress,
  StatusRejected,
  StatusWaitingValidation
} from '@opencrvs/components/lib/icons'
import styled from 'styled-components'
import { LinkButton } from '@opencrvs/components/lib/buttons'
import { LoadingGrey } from '@opencrvs/components/lib/ListTable'
import { Table } from '@opencrvs/components/lib/Table'
import { GenericErrorToast } from '@client/components/GenericErrorToast'
import { DateRangePicker } from '@client/components/DateRangePicker'
import { ITheme } from '@opencrvs/components/lib/theme'
import {
  IColumn,
  ColumnContentAlignment
} from '@opencrvs/components/lib/Workqueue'
import { getUserAuditDescription } from '@client/views/SysAdmin/Team/utils'

import { orderBy } from 'lodash'
import { SORT_ORDER } from '@client/views/SysAdmin/Performance/reports/completenessRates/CompletenessDataTable'
import subMonths from 'date-fns/subMonths'
import format from '@client/utils/date-formatting'

import {
  IOnlineStatusProps,
  withOnlineStatus
} from '@client/views/OfficeHome/LoadingIndicator'
import { ISearchLocation } from '@opencrvs/components/lib/LocationSearch'
import { GetUserAuditLogQuery } from '@client/utils/gateway'
import { ILocation } from '@client/offline/reducer'
import { ICurrency } from '@client/utils/referenceApi'
import { RouteComponentProps } from 'react-router'
import { IUserDetails } from '@client/utils/userUtils'
import { REGISTRAR_ROLES } from '@client/utils/constants'
import { NameContainer } from '@client/views/OfficeHome/components'

const DEFAULT_LIST_SIZE = 10

const InformationCaption = styled.div`
  ${({ theme }) => theme.fonts.reg12};
  padding-bottom: 5px;
`

const AuditDescTimeContainer = styled.div`
  display: flex;
  flex-direction: column;
  & > :first-child {
    padding-top: 5px;
  }
`
const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const RecentActionsHolder = styled.div`
  margin-top: 40px;
  padding-top: 30px;
  @media (max-width: ${({ theme }) => theme.grid.breakpoints.md}px) {
    margin-top: 24px;
    padding-top: 24px;
  }
  border-top: 1px solid ${({ theme }) => theme.colors.grey200};
`

const AlignedDateRangePicker = styled(DateRangePicker)`
  position: absolute;
  bottom: 10px;
`

const SectionTitle = styled.div`
  ${({ theme }) => theme.fonts.h2};
  margin-bottom: 10px;
`

const StatusIcon = styled.div`
  margin-top: 4px;
`

const AdjustedStatusIcon = styled.div`
  margin-left: 3px;
`

const InformationTitle = styled.div`
  ${({ theme }) => theme.fonts.bold16};
  width: 320px;
`

interface IBaseProp {
  theme: ITheme
  practitionerId: string
  isLoading?: boolean
}

interface DispatchProps {
  goToDeclarationRecordAudit: typeof goToDeclarationRecordAudit
}

interface IBasePrintTabProps {
  goToDeclarationRecordAudit: typeof goToDeclarationRecordAudit
}

interface IConnectProps {
  locations: { [key: string]: ILocation }
  offices: { [key: string]: ILocation }
  currency: ICurrency
}

type Props = WrappedComponentProps &
  IBaseProp &
  IOnlineStatusProps &
  DispatchProps &
  RouteComponentProps & { userDetails: IUserDetails | null } & IConnectProps & {
    theme: ITheme
  }

export enum SORTED_COLUMN {
  ACTION = 'actionDescriptionString',
  EVENT = 'eventType',
  RECORD = 'trackingIdString',
  DATE = 'auditTime',
  DEVICE = 'deviceIpAddress'
}

type State = {
  selectedLocation?: ISearchLocation
  timeStart: Date
  timeEnd: Date
  viewportWidth: number
  sortOrder: SORT_ORDER
  sortedColumn: SORTED_COLUMN
  currentPageNumber: number
  officeSelected?: boolean
  isAccessibleOffice?: boolean
}

const isUserAuditItemWithDeclarationDetials = (
  item: GQLUserAuditLogResultItem
): item is GQLUserAuditLogItemWithComposition => {
  return (item as any).data
}

class UserAuditHistoryComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    window.__localeId__ = props.intl.locale
    this.state = {
      timeStart: subMonths(new Date(Date.now()), 1),
      timeEnd: new Date(Date.now()),
      viewportWidth: 0,
      currentPageNumber: 1,
      sortOrder: SORT_ORDER.DESCENDING,
      sortedColumn: SORTED_COLUMN.DATE
    }
    this.updateViewPort = this.updateViewPort.bind(this)
  }

  componentDidMount() {
    this.updateViewPort()
    window.addEventListener('resize', this.updateViewPort)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewPort)
  }

  setDateRangePickerValues(startDate: Date, endDate: Date) {
    this.setState({
      timeStart: startDate,
      timeEnd: endDate
    })
  }

  toggleSortOrder(columnName: SORTED_COLUMN) {
    this.setState({
      sortedColumn: columnName,
      sortOrder:
        this.state.sortOrder === SORT_ORDER.DESCENDING
          ? SORT_ORDER.ASCENDING
          : SORT_ORDER.DESCENDING
    })
  }

  setCurrentPage = (currentPage: number) => {
    this.setState({ currentPageNumber: currentPage })
  }

  updateViewPort() {
    this.setState({ viewportWidth: window.innerWidth })
  }

  getAuditColumns() {
    const { theme, intl } = this.props
    let columns: IColumn[] = []
    if (this.state.viewportWidth <= theme.grid.breakpoints.md) {
      columns = [
        {
          label: intl.formatMessage(messages.auditActionColumnTitle),
          width: 80,
          key: 'actionDescriptionWithAuditTime'
        },
        {
          label: intl.formatMessage(messages.auditTrackingIDColumnTitle),
          width: 20,
          key: 'trackingId',
          alignment: ColumnContentAlignment.RIGHT
        }
      ]
    } else {
      columns = [
        {
          label: intl.formatMessage(messages.auditActionColumnTitle),
          width: 25,
          isSortable: true,
          icon: <ArrowDownBlue />,
          key: 'actionDescription',
          sortFunction: () => this.toggleSortOrder(SORTED_COLUMN.ACTION)
        },
        {
          label: intl.formatMessage(messages.auditTrackingIDColumnTitle),
          width: 25,
          isSortable: true,
          icon: <ArrowDownBlue />,
          key: 'trackingId',
          sortFunction: () => this.toggleSortOrder(SORTED_COLUMN.RECORD)
        },
        {
          label: intl.formatMessage(messages.auditDeviceIpAddressColumnTitle),
          width: 25,
          isSortable: true,
          icon: <ArrowDownBlue />,
          key: 'deviceIpAddress',
          alignment: ColumnContentAlignment.LEFT,
          sortFunction: () => this.toggleSortOrder(SORTED_COLUMN.DEVICE)
        },
        {
          label: intl.formatMessage(messages.auditDateColumnTitle),
          width: 25,
          key: 'auditTime',
          isSortable: true,
          isSorted: true,
          icon: <ArrowDownBlue />,
          alignment: ColumnContentAlignment.RIGHT,
          sortFunction: () => this.toggleSortOrder(SORTED_COLUMN.DATE)
        }
      ]
    }
    return columns
  }

  getWorkflowStatusIcon = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <StatusProgress />
      case 'DECLARED':
        return (
          <AdjustedStatusIcon>
            <StatusOrange />
          </AdjustedStatusIcon>
        )
      case 'VALIDATED':
        return (
          <StatusIcon>
            <StatusGray />
          </StatusIcon>
        )
      case 'WAITING_VALIDATION':
        return (
          <StatusIcon>
            <StatusWaitingValidation />
          </StatusIcon>
        )
      case 'REGISTERED':
        return (
          <StatusIcon>
            <StatusGreen />
          </StatusIcon>
        )
      case 'REJECTED':
        return (
          <StatusIcon>
            <StatusRejected />
          </StatusIcon>
        )
      case 'CERTIFIED':
        return (
          <StatusIcon>
            <StatusCollected />
          </StatusIcon>
        )
      default:
        return (
          <StatusIcon>
            <StatusOrange />
          </StatusIcon>
        )
    }
  }

  getAuditData(data: GQLUserAuditLogResultSet) {
    const auditList = data.results.map((userAuditItem) => {
      if (userAuditItem === null) {
        return {}
      }
      const actionDescriptor = getUserAuditDescription(userAuditItem.action)

      const device = Bowser.getParser(userAuditItem.userAgent).getResult()

      const deviceIpAddress =
        [
          device.platform.vendor,
          device.os.name,
          device.browser ? `(${device.browser.name})` : ''
        ]
          .filter(Boolean)
          .join(' ') +
        ' • ' +
        userAuditItem.ipAddress

      return {
        actionDescription: (
          <NameContainer isBoldLink={true}>
            {(actionDescriptor &&
              this.props.intl.formatMessage(actionDescriptor)) ||
              ''}
          </NameContainer>
        ),
        actionDescriptionWithAuditTime: (
          <AuditDescTimeContainer>
            <InformationTitle>
              {(actionDescriptor &&
                this.props.intl.formatMessage(actionDescriptor)) ||
                ''}
            </InformationTitle>
            <InformationCaption>
              {format(new Date(userAuditItem.time), 'MMMM dd, yyyy hh:mm a')}
            </InformationCaption>
          </AuditDescTimeContainer>
        ),
        trackingId: isUserAuditItemWithDeclarationDetials(userAuditItem) ? (
          <LinkButton
            onClick={() =>
              this.props.goToDeclarationRecordAudit(
                'printTab',
                userAuditItem.data.compositionId as string
              )
            }
          >
            {userAuditItem.data.trackingId}
          </LinkButton>
        ) : null,
        deviceIpAddress: deviceIpAddress,
        trackingIdString: isUserAuditItemWithDeclarationDetials(userAuditItem)
          ? userAuditItem.data.trackingId
          : null,
        auditTime: format(new Date(userAuditItem.time), 'MMMM dd, yyyy hh:mm a')
      }
    })
    return (
      (auditList &&
        orderBy(
          auditList,
          [this.state.sortedColumn],
          [this.state.sortOrder]
        )) ||
      []
    )
  }

  getLoadingView() {
    return (
      <>
        <SectionTitle>
          <LoadingGrey width={5} />
        </SectionTitle>
        <LoadingGrey width={10} />
        {this.getLoadingAuditListView()}
      </>
    )
  }

  isOfficeSelected(selectedLocation?: ISearchLocation) {
    if (selectedLocation) {
      return Object.keys(this.props.offices).some(
        (id) => id === selectedLocation.id
      )
    }
    return false
  }

  isAccessibleOfficeSelected(selectedLocation?: ISearchLocation) {
    if (
      selectedLocation &&
      this.isOfficeSelected(selectedLocation) &&
      this.props.userDetails &&
      this.props.userDetails.role
    ) {
      if (this.props.userDetails?.role === 'NATIONAL_REGISTRAR') {
        return true
      } else if (
        REGISTRAR_ROLES.includes(this.props.userDetails?.role) &&
        this.props.userDetails.primaryOffice?.id === selectedLocation.id
      ) {
        return true
      }
    }
    return false
  }

  componentDidUpdate(_: Props, prevState: State) {
    if (this.state.selectedLocation !== prevState.selectedLocation) {
      this.setState({
        officeSelected: this.isOfficeSelected(this.state.selectedLocation),
        isAccessibleOffice: this.isAccessibleOfficeSelected(
          this.state.selectedLocation
        )
      })
    }
  }

  getLoadingAuditListView(hasError?: boolean) {
    return (
      <>
        <Table
          id="loading-audit-list"
          isLoading={true}
          columns={this.getAuditColumns()}
          content={[]}
          noResultText={this.props.intl.formatMessage(messages.noAuditFound)}
          hideTableHeader={
            this.state.viewportWidth <= this.props.theme.grid.breakpoints.md
          }
        />
        {hasError && <GenericErrorToast />}
      </>
    )
  }

  render() {
    const { intl, practitionerId, theme, isLoading } = this.props
    const { timeStart, timeEnd, currentPageNumber } = this.state
    const recordCount = DEFAULT_LIST_SIZE * this.state.currentPageNumber

    return (
      <RecentActionsHolder id="user-audit-list">
        {isLoading && this.getLoadingView()}
        {!isLoading && (
          <>
            <HistoryHeader>
              <SectionTitle>
                {intl.formatMessage(messages.auditSectionTitle)}
              </SectionTitle>
              <AlignedDateRangePicker
                startDate={timeStart}
                endDate={timeEnd}
                onDatesChange={({ startDate, endDate }) => {
                  this.setDateRangePickerValues(startDate, endDate)
                }}
              />
            </HistoryHeader>
            <>
              <Query<GetUserAuditLogQuery>
                query={GET_USER_AUDIT_LOG}
                variables={{
                  practitionerId: practitionerId,
                  count: recordCount,
                  skip: DEFAULT_LIST_SIZE * (currentPageNumber - 1)
                }}
                fetchPolicy={'no-cache'}
              >
                {({ data, loading, error }) => {
                  if (error || !data || !data.getUserAuditLog) {
                    return this.getLoadingAuditListView(true)
                  } else {
                    const totalItems = Number(
                      (data &&
                        data.getUserAuditLog &&
                        data.getUserAuditLog.total) ||
                        0
                    )

                    return (
                      <Table
                        columns={this.getAuditColumns()}
                        content={this.getAuditData(data.getUserAuditLog)}
                        noResultText={intl.formatMessage(messages.noAuditFound)}
                        isLoading={loading}
                        hideTableHeader={
                          this.state.viewportWidth <= theme.grid.breakpoints.md
                        }
                        currentPage={this.state.currentPageNumber}
                        pageSize={recordCount}
                        totalItems={totalItems}
                        onPageChange={(currentPage: number) => {
                          this.setCurrentPage(currentPage)
                        }}
                      />
                    )
                  }
                }}
              </Query>
            </>
          </>
        )}
      </RecentActionsHolder>
    )
  }
}

// export const UserAuditHistory = withTheme(
//   injectIntl(withOnlineStatus(UserAuditHistoryComponent))
// )

export const UserAuditHistory = connect(null, {
  goToDeclarationRecordAudit
})(withTheme(injectIntl(withOnlineStatus(UserAuditHistoryComponent))))