import React from 'react';
import styled from 'styled-components';

const StyledIcon = styled.i<{ size: number }>`
  vertical-align: middle;
  display: inline-block;
  font-size: ${({ size }): string => `${size}px`};
`;

interface Props {
  size?: number;
  children?: React.ReactNode;
  className?: string;
}

const Icon = ({ size = 16, children = null, className = '' }: Props) => {
  return (
    <StyledIcon size={size} className={`${className} material-icons`}>
      {children}
    </StyledIcon>
  );
};

export default Icon;
