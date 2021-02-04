import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SocketContext } from '../../context';
import Input from '../Input';
import Button from '../Button';
import CheckBox from '../Checkbox';
import Alert from '../Alert';
import Link from '../Link';

interface TestState {
  checking?: boolean;
  success?: boolean;
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

const SaveButton = styled(Button)`
  margin-left: 10px;
`;

const Wizard: React.FC<Props> = ({ onSubmit: onSubmitHandler }: Props) => {
  const [authEnabled, setAuthEnabled] = useState(true);
  const [server, setServer] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [test, setTest] = useState<TestState>({});
  const socket = useContext(SocketContext);

  const getMessage = (): string => {
    let message: { [key: string]: string } = { server };

    if (authEnabled) {
      message = { ...message, username, password };
    }

    return JSON.stringify(message);
  };

  const onSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (test.success) {
      return;
    }

    socket.emit('config:test', getMessage());
    setTest((prevState) => ({
      ...prevState,
      failed: false,
      success: false,
      checking: true
    }));
  };

  const onSave = () => {
    socket.emit('config:set', getMessage());
  };

  const onCancel = () => {
    setTest((prevState) => ({ ...prevState, success: false }));
  };

  const onConfigTestSuccess = () => {
    setTest((prevState) => ({
      ...prevState,
      checking: false,
      success: true
    }));
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
  }, [username, server, password, test]);

  function onChangeWithCallBack(
    evt: React.ChangeEvent<HTMLInputElement>,
    cb: Function
  ) {
    if (test.failed) {
      setTest((prevState) => ({ ...prevState, failed: false }));
    }
    cb(evt.target.value);
  }

  function renderAlert() {
    if (!test.success && !test.failed) {
      return null;
    }

    let message = `Unable to establish connection with ${server}`;
    let type: 'success' | 'error' = 'error';

    if (test.success) {
      message = 'Connection established';
      type = 'success';
    }

    return <AlertBox type={type}>{message}</AlertBox>;
  }

  function renderFooter() {
    if (test.success) {
      return (
        <Footer>
          <Link onClick={onCancel}>Cancel</Link>
          <SaveButton onClick={onSave}>Save</SaveButton>
        </Footer>
      );
    }

    return (
      <Footer>
        <Button disabled={test.checking}>Test connectivity</Button>
      </Footer>
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
          disabled={test.checking || test.success}
          value={server}
          onChange={(evt) => {
            onChangeWithCallBack(evt, setServer);
          }}
        />
      </FormBlock>
      <FormBlock>
        <CheckBox
          label="Is it authentication enabled?"
          disabled={test.checking || test.success}
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
          disabled={!authEnabled || test.checking || test.success}
          placeholder="transmission"
          required
          value={username}
          onChange={(evt) => {
            onChangeWithCallBack(evt, setUsername);
          }}
        />
      </FormBlock>
      <FormBlock>
        <Input
          disabled={!authEnabled || test.checking || test.success}
          label="Password"
          icon="vpn_key"
          type="password"
          required
          value={password}
          onChange={(evt) => {
            onChangeWithCallBack(evt, setPassword);
          }}
        />
      </FormBlock>
      {renderFooter()}
      {renderAlert()}
    </Form>
  );
};

export default Wizard;
