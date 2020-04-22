import React from 'react';
import spinner from '../../svg/spinner.svg';

interface Props {
  width?: number;
  className?: string;
  height?: number;
}

const Spinner: React.FC<Props> = ({ height, width, className }) => (
  <img
    width={width}
    height={height}
    src={spinner}
    alt="loading"
    className={className}
  />
);

export default Spinner;
