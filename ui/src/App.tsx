import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Socket } from 'socket.io-client';

import Actions from './components/Actions';
import Wizard from './components/Wizard';

const Container = styled.div`
  display: flex;
  height: 100vh;
  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 20px 10px;
`;

interface Props {
  socket: typeof Socket;
}

interface Config {
  configured: boolean;
  theme: string;
  serverUrl: string;
  username: string;
}

const App: React.FunctionComponent<Props> = (props) => {
  const [config, setConfig] = useState<Partial<Config>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    props.socket.on('init', (message: Config) => {
      setConfig(message);
      setConnected(true);
      setLoading(false);
    });

    props.socket.on('disconnect', () => {
      setConnected(false);
    });

    props.socket.on('reconnect', () => {
      setConnected(true);
    });
  }, [props.socket]);

  if (!connected) {
    return (
      <Container>
        <Content>disconnected ...</Content>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Content>loading ...</Content>
      </Container>
    );
  }

  if (!config.configured) {
    return (
      <Container>
        <Content>
          <Wizard />
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Actions />
      </Content>
    </Container>
  );
};

export default App;
