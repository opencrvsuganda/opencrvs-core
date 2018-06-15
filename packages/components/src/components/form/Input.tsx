import * as React from 'react'
import styled, { StyledFunction } from 'styled-components'

export interface ICustomProps {
  error?: boolean
  touched?: boolean
}

export type IInputProps = ICustomProps &
  React.InputHTMLAttributes<HTMLInputElement>

const styledInput = styled.input.attrs<IInputProps>({})

const StyledInput = styledInput`
  width: 100%;
  min-height: 30px;
  transition: border-color 500ms ease-out;
  border: 0px solid;
  border-bottom: solid 1px
    ${({ error, touched, theme }) =>
      error && touched ? theme.colors.error : theme.colors.disabled};
  padding: 0 2px;
  outline: none;
  ${({ theme }) => theme.fonts.defaultFontStyle};
  color: ${({ theme }) => theme.colors.secondary};
  &:focus {
    border-bottom: solid 1px ${({ theme }) => theme.colors.accent};
  }

  &::-webkit-input-placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  &::-moz-placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  &:-ms-input-placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &[type='number'] {
    -moz-appearance: textfield;
    padding: 0;
    text-indent: 20px;
  }
`

export class Input extends React.Component<IInputProps> {
  render() {
    return <StyledInput {...this.props} />
  }
}
