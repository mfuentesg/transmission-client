import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid4 } from 'uuid';

interface FieldProps {
  withIcon?: boolean;
}

interface Props {
  placeholder?: string;
  type?: string;
  label?: string;
  icon?: string;
  id?: string;
}

const Field = styled.input<FieldProps>((props) => ({
  appearance: 'none',
  backgroundColor: 'transparent',
  border: 'none',
  boxSizing: 'border-box',
  color: '#0f2c4c',
  padding: '5px 10px',
  fontSize: '16px',
  width: props.withIcon ? 'calc(100% - 33px)' : '100%'
}));

const Container = styled.div`
  border-radius: 5px;
  background-color: #f6f6f6;
  border: 2px solid #f6f6f6;
`;

const Label = styled.label`
  display: block;
  width: auto;
  font-family: 'Baloo Paaji 2', 'sans-serif';
  margin-bottom: 5px;
`;

const Icon = styled.i`
  display: inline-block;
  color: #489c85;
  font-size: 18px;
  padding: 0 5px;
  margin-left: 5px;
  vertical-align: middle;
`;

const Input: React.FunctionComponent<Props> = (props) => {
  const [id, setId] = useState<string>(props.id || '');

  useEffect(() => {
    setId(uuid4());
  }, []);

  return (
    <>
      {props.label && <Label htmlFor={id}>{props.label}</Label>}

      <Container>
        {props.icon && <Icon className="material-icons">{props.icon}</Icon>}
        <Field
          type={props.type}
          withIcon={Boolean(props.icon)}
          placeholder={props.placeholder}
          id={id}
        />
      </Container>
    </>
  );
};

Input.defaultProps = {
  type: 'text'
};

export default Input;
