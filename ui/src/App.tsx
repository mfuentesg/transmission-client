import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SocketContext } from './context';
import Actions from './components/Actions';
import Wizard from './components/Wizard';
import Spinner from './components/Spinner';

const Container = styled.div`
  display: flex;
  height: 100vh;
  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 20px 10px;
  position: relative;
`;

const CenteredSpinner = styled(Spinner)`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto auto;
`;

interface Config {
  configured: boolean;
  theme: string;
  serverUrl: string;
  username: string;
}

const App: React.FunctionComponent = () => {
  const [config, setConfig] = useState<Partial<Config>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState<boolean>(true);
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.on('end', () => {});

    socket.on('init', (message: Config) => {
      setConfig(message);
      setConnected(true);
      setLoading(false);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('close', () => {
      socket.close();
    });

    socket.on('reconnect', () => {
      setConnected(true);
    });
  }, []);

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
        <Content>
          <CenteredSpinner height={50} />
        </Content>
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
