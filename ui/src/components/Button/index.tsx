import React from 'react';
import styled from 'styled-components';

export interface Props {
  type?: string;
  onClick?: Function;
  className?: string;
}

export const Button: React.FunctionComponent<Props> = (props) => {
  return <button className={props.className}>{props.children}</button>;
};

const StyledButton = styled(Button)`
  background-color: #f6f6f6;
  border-radius: 3px;
  border: 1px solid #f1f0f0;
  color: #11335d;
  font-size: 16px;
  padding: 5px 10px;
  text-align: left;
  width: ${(props) => (props.type === 'wide' ? '100%' : 'auto')};
`;

export default StyledButton;
