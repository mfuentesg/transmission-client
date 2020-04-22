import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { SocketContext } from '../../context';
import Input from '../Input';
import Button from '../Button';
import CheckBox from '../Checkbox';
import Alert from '../Alert';

interface TestState {
  checking?: boolean;
  success?: boolean;
  failed?: boolean;
}

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

const AlertBox = styled(Alert)`
  margin-top: 15px;
`;

const Wizard = () => {
  const [authEnabled, setAuthEnabled] = useState(true);
  const [server, setServer] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [test, setTest] = useState<TestState>({});
  const socket = useContext(SocketContext);

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    socket.emit('config:set', JSON.stringify({ server, username, password }));
    setTest((prevState) => ({
      ...prevState,
      failed: false,
      success: false,
      checking: true
    }));
  };

  useEffect(() => {
    socket.on('config:test:success', () => {
      setTest((prevState) => ({
        ...prevState,
        checking: false,
        success: true
      }));

      socket.emit('config:set', JSON.stringify({ server, username, password }));
    });

    socket.on('config:test:failed', () => {
      setTest((prevState) => ({
        ...prevState,
        failed: true,
        checking: false
      }));
    });
  }, []);

  function renderAlert() {
    let message = 'Unable to establish server connection';
    let type = 'error';

    if (!test.success && !test.failed) {
      return null;
    }

    if (test.success) {
      message = 'Connection established';
      type = 'success';
    }

    // @ts-ignore
    return <AlertBox type={type}>{message}</AlertBox>;
  }

  return (
    <Form onSubmit={onSubmit}>
      <Title>Setup</Title>
      <FormBlock>
        <Input
          placeholder="https://"
          label="Server URL"
          icon="link"
          type="url"
          required
          disabled={test.checking}
          value={server}
          onChange={(evt) => {
            setServer(evt.target.value);
          }}
        />
      </FormBlock>
      <FormBlock>
        <CheckBox
          label="Is it authentication enabled?"
          disabled={test.checking}
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
          disabled={!authEnabled || test.checking}
          placeholder="transmission"
          required
          value={username}
          onChange={(evt) => {
            setUsername(evt.target.value);
          }}
        />
      </FormBlock>
      <FormBlock>
        <Input
          disabled={!authEnabled || test.checking}
          label="Password"
          icon="vpn_key"
          type="password"
          required
          value={password}
          onChange={(evt) => {
            setPassword(evt.target.value);
          }}
        />
      </FormBlock>
      <Footer>
        <Button disabled={test.checking}>Test & Save</Button>
      </Footer>
      {renderAlert()}
    </Form>
  );
};

export default Wizard;
