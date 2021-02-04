import React from 'react';
import styled from 'styled-components';

export interface Props {
  type?: string;
  disabled?: boolean;
  onClick?(evt: React.MouseEvent<HTMLButtonElement>): void;
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FunctionComponent<Props> = ({
  children,
  onClick,
  className = '',
  disabled = false
}: Props) => {
  return (
    <button disabled={disabled} className={className} onClick={onClick}>
      {children}
    </button>
  );
};

const StyledButton = styled(Button)((props) => ({
  backgroundColor: props.disabled ? '#dcdcdc' : '#f6f6f6',
  borderRadius: '3px',
  border: '1px solid #f1f1f1',
  color: props.disabled ? '#989898' : '#11335d',
  fontSize: '16px',
  padding: '5px 10px',
  lineHeight: 'inherit',
  textAlign: 'left',
  width: props.type === 'wide' ? '100%' : 'auto'
}));

export default StyledButton;
