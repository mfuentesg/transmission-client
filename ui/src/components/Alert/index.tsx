import styled from 'styled-components';
import React from 'react';

interface Props {
  type?: 'info' | 'success' | 'error' | 'warning';
  fixed?: boolean;
  className?: string;
}

const colors: { [key: string]: { [key: string]: string } } = {
  info: {
    background: '#f6f6f6',
    border: '#f1f0f0'
  },
  success: {
    background: '#d5f2bc',
    border: '#c6ddb3'
  },
  error: {
    background: '#f6cece',
    border: '#f0c9c9'
  },
  warning: {
    background: '#fefac3',
    border: '#eeeab7'
  }
};

export const Alert: React.FunctionComponent<Props> = (props) => {
  return <div className={props.className}>{props.children}</div>;
};

Alert.defaultProps = {
  fixed: false,
  type: 'info'
};

const StyledAlert = styled(Alert)(({ type = 'info' }) => {
  const color = colors[type];

  return {
    padding: '15px 10px',
    backgroundColor: color.background,
    border: `1px solid ${color.border}`,
    borderRadius: '5px',
    fontFamily: `'Baloo Paaji 2', 'sans-serif'`,
    color: '#797979'
  };
});

export default StyledAlert;
