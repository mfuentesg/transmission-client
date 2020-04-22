import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SocketContext } from '../../context';
import Input from '../Input';
import Button from '../Button';
import CheckBox from '../Checkbox';
import Alert from '../Alert';

// import { useSocketEvents } from '../../hooks';

interface TestState {
  checking?: boolean;
  failed?: boolean;
}

interface Props {
  onSubmit?(): void;
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

const Wizard: React.FC<Props> = ({ onSubmit: onSubmitHandler }) => {
  const [authEnabled, setAuthEnabled] = useState(true);
  const [server, setServer] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [test, setTest] = useState<TestState>({});
  const socket = useContext(SocketContext);

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    socket.emit('config:test', JSON.stringify({ username, server, password }));
    setTest((prevState) => ({
      ...prevState,
      failed: false,
      checking: true
    }));
  };

  const onConfigTestSuccess = () => {
    socket.emit('config:set', JSON.stringify({ username, server, password }));
  };

  const onConfigTestFailed = () => {
    setTest((prevState) => ({
      ...prevState,
      failed: true,
      checking: false
    }));
  };

  const onConfigSetSuccess = () => {
    if (onSubmitHandler) {
      onSubmitHandler();
    }
  };

  const onConfigSetFailed = () => {};

  useEffect(() => {
    socket.on('config:test:success', onConfigTestSuccess);
    socket.on('config:test:failed', onConfigTestFailed);
    socket.on('config:set:success', onConfigSetSuccess);
    socket.on('config:set:failed', onConfigSetFailed);

    return () => {
      socket.off('config:test:success', onConfigTestSuccess);
      socket.off('config:test:failed', onConfigTestFailed);
      socket.off('config:set:success', onConfigSetSuccess);
      socket.off('config:set:failed', onConfigSetFailed);
    };
  }, [username, server, password]);

  function renderAlert() {
    if (!test.failed) {
      return null;
    }

    return (
      <AlertBox type="error">
        Unable to establish connection with ${server}
      </AlertBox>
    );
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
