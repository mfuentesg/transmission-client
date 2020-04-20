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
  text-align: left;
  width: ${(props) => (props.type === 'wide' ? '100%' : 'auto')};
  font-size: 16px;
  background-color: #f6f6f6;
  padding: 5px 10px;
  border: 1px solid #f1f0f0;
  border-radius: 3px;
  color: #11335d;
`;

export default StyledButton;
