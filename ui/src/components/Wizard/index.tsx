import React, { useState } from 'react';
import styled from 'styled-components';

import Input from '../Input';
import Button from '../Button';
import CheckBox from '../Checkbox';

const Form = styled.form`
  border-radius: 5px;
  border: 1px solid #f1f1f1;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.03);
  margin: 0 auto;
  max-width: 320px;
  overflow: auto;
  padding: 20px;
`;

const FormBlock = styled.div`
  margin-bottom: 20px;
`;

const Footer = styled.div`
  border-top: 1px dashed #f1f1f1;
  padding-top: 20px;
  text-align: right;
`;

const Title = styled.h2`
  font-family: 'Baloo Paaji 2', 'sans-serif';
  font-size: 20px;
  margin-bottom: 20px;
`;

const SaveButton = styled(Button)`
  margin-left: 10px;
  min-width: 100px;
  text-align: center;
`;

const Wizard = () => {
  const [authEnabled, setAuthEnabled] = useState(true);

  return (
    <Form>
      <Title>Setup</Title>
      <FormBlock>
        <Input
          placeholder="https://"
          label="Server URL"
          icon="link"
          type="url"
          required
        />
      </FormBlock>
      <FormBlock>
        <CheckBox
          label="Is it authentication enabled?"
          checked={authEnabled}
          onChange={(evt: React.ChangeEvent<HTMLInputElement>) => {
            setAuthEnabled(evt.target.checked);
          }}
        />
      </FormBlock>
      <FormBlock>
        <Input
          label="Username"
          icon="face"
          disabled={!authEnabled}
          placeholder="transmission"
          required
        />
      </FormBlock>
      <FormBlock>
        <Input
          disabled={!authEnabled}
          label="Password"
          icon="vpn_key"
          type="password"
          required
        />
      </FormBlock>
      <Footer>
        <Button>Test connectivity</Button>
        <SaveButton>Save</SaveButton>
      </Footer>
    </Form>
  );
};

export default Wizard;
