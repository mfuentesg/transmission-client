import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid4 } from 'uuid';

interface FieldProps {
  withIcon?: boolean;
}

interface Props {
  onChange(evt: React.ChangeEvent<HTMLInputElement>): void;
  icon?: string;
  id?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
}

interface ContainerProps {
  disabled?: boolean;
}

const Field = styled.input<FieldProps>((props: FieldProps) => ({
  appearance: 'none',
  backgroundColor: 'transparent',
  border: 'none',
  boxSizing: 'border-box',
  color: '#0f2c4c',
  padding: '5px 10px',
  fontSize: '16px',
  width: props.withIcon ? 'calc(100% - 33px)' : '100%'
}));

const Container = styled.div<ContainerProps>(({ disabled = false }) => ({
  borderRadius: '5px',
  backgroundColor: disabled ? '#dfdfdf' : '#f6f6f6',
  border: `1px solid ${disabled ? '#d7d7d7' : '#f1f1f1'}`
}));

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

const Input: React.FunctionComponent<Props> = ({
  label = '',
  icon = '',
  id: fieldId = '',
  type = 'text',
  placeholder = '',
  value = '',
  disabled = false,
  required = false,
  onChange: onChangeHandler
}: Props) => {
  const [id, setId] = useState<string>(fieldId);

  useEffect(() => {
    setId(uuid4());
  }, []);

  return (
    <>
      {label && <Label htmlFor={id}>{label}</Label>}

      <Container disabled={disabled}>
        {icon && <Icon className="material-icons">{icon}</Icon>}
        <Field
          onChange={onChangeHandler}
          required={required && !disabled}
          disabled={disabled}
          type={type}
          value={value}
          withIcon={Boolean(icon)}
          placeholder={placeholder}
          id={id}
        />
      </Container>
    </>
  );
};

export default Input;
