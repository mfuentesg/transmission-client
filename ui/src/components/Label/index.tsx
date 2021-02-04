import React from 'react';
import styled from 'styled-components';

export interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Label: React.FC<Props> = (props: Props) => {
  return <label className={props.className}>{props.children}</label>;
};

const StyledLabel = styled(Label)`
  letter-spacing: 1px;
  color: #9d9d9d;
  font-size: 16px;
  font-weight: 400;
  display: inline-block;
`;

export default StyledLabel;
