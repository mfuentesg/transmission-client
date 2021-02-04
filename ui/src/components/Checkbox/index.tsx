import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuid4 } from 'uuid';

interface Props {
  label?: string;
  id?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: Function;
}

interface IconProps {
  checked: boolean;
}

const Input = styled.input`
  display: none;
`;

const Icon = styled.i<IconProps>((props) => ({
  fontSize: '12px',
  fontWeight: 'bold',
  height: '12px',
  opacity: props.checked ? '1' : '0',
  transition: 'all ease-in-out 0.17s',
  visibility: props.checked ? 'visible' : 'hidden'
}));

const Text = styled.span`
  font-family: 'Baloo Paaji 2', 'sans-serif';
  margin-left: 5px;
  font-weight: 300;
  vertical-align: middle;
  display: inline-block;
`;

const IconHolder = styled.span<IconProps>((props) => ({
  backgroundColor: props.checked ? '#489c85' : '#fff',
  border: '2px solid #489c85',
  borderRadius: '50%',
  color: 'white',
  display: 'inline-block',
  height: '14px',
  textAlign: 'center',
  transition: 'all ease-in-out 0.17s',
  verticalAlign: 'middle',
  width: '14px'
}));

const CheckBox: React.FunctionComponent<Props> = ({
  checked = false,
  onChange,
  disabled = false,
  id: fieldId = '',
  label = ''
}: Props) => {
  const [id, setId] = useState<string>(fieldId);

  useEffect(() => {
    setId(uuid4());
  }, []);

  const onChangeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(evt);
    }
  };

  return (
    <label htmlFor={id}>
      <Input
        type="checkbox"
        id={id}
        disabled={disabled}
        checked={checked}
        onChange={onChangeHandler}
      />
      <IconHolder checked={checked}>
        <Icon className="material-icons" checked={checked}>
          check
        </Icon>
      </IconHolder>
      {label && <Text>{label}</Text>}
    </label>
  );
};

export default CheckBox;
