import React from 'react';
import styled from 'styled-components';

import Input from '../Input';
import Button from '../Button';

const Form = styled.form`
  overflow: auto;
  margin: 10px auto 0;
  max-width: 320px;
  border: 1px solid #f1f1f1;
  padding: 20px;
`;

const FormBlock = styled.div`
  margin-bottom: 20px;
`;

const Footer = styled.div`
  text-align: right;
`;

const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 20px;
  font-family: 'Baloo Paaji 2', 'sans-serif';
`;

const SaveButton = styled(Button)`
  margin-left: 10px;
  min-width: 100px;
  text-align: center;
`;

const Wizard = () => {
  return (
    <Form>
      <Title>Setup</Title>
      <FormBlock>
        <Input
          placeholder="https://"
          label="Server URL"
          icon="link"
          type="url"
        />
      </FormBlock>
      <FormBlock>
        <Input label="Username" icon="face" placeholder="transmission" />
      </FormBlock>
      <FormBlock>
        <Input label="Password" icon="vpn_key" type="password" />
      </FormBlock>
      <Footer>
        <Button>Test connectivity</Button>
        <SaveButton>Save</SaveButton>
      </Footer>
    </Form>
  );
};

export default Wizard;
