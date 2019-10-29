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
import styled, { withTheme } from 'styled-components'
import { Cross } from '../icons'
import Uploaded from '../icons/Uploaded'
import { ITheme } from '../theme'

interface IProps {
  id: string
  file: {
    title: string
    description: string
    type: string
    data: string
  }
  deleteLabel?: string
  onDelete: () => void
  previewLabel?: string
  onPreview: () => void
  theme: ITheme
}

const Container = styled.div`
  display: flex;
  @media (max-width: ${({ theme }) => theme.grid.breakpoints.md}px) {
    display: block;
  }
`

const Link = styled.a`
  ${({ theme }) => theme.fonts.bodyStyle};
  text-decoration: underline;
  cursor: pointer;
`

const PreviewLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
`

const DeleteLink = styled(Link)`
  color: ${({ theme }) => theme.colors.error};
  margin-left: 8px;
`

const FileContainer = styled.div`
  height: 75px;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 1px;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.11);
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16px;
`

const DeleteContainer = styled.div`
  height: 75px;
  margin-left: 30px;
  margin-right: 25px;
  justify-content: center;
  align-items: center;
  display: flex;
`

const MetadataContainer = styled.div`
  ${({ theme }) => theme.fonts.bigBodyStyle};
  color: ${({ theme }) => theme.colors.secondary};

  display: flex;
  flex-direction: column;
  flex: 1;
  margin: 0 16px;
`

class FileItemComponent extends React.Component<IProps> {
  render() {
    const { title, description } = this.props.file
    const {
      id,
      deleteLabel,
      onDelete,
      previewLabel,
      onPreview,
      theme
    } = this.props

    return (
      <Container id={id}>
        <FileContainer>
          <Uploaded />
          <MetadataContainer>
            <span>{title}</span>
            <span>{description}</span>
          </MetadataContainer>
          <PreviewLink id={`${id}_preview_link`} onClick={onPreview}>
            {previewLabel ? previewLabel : 'Preview'}
          </PreviewLink>
        </FileContainer>
        <DeleteContainer id={`${id}_delete_link`} onClick={onDelete}>
          <Cross color={theme.colors.error} />
          <DeleteLink>{deleteLabel ? deleteLabel : 'Delete'}</DeleteLink>
        </DeleteContainer>
      </Container>
    )
  }
}

export const FileItem = withTheme(FileItemComponent)
