import React from 'react';
import { Socket } from 'socket.io-client';
import socket from '../socket';

export const SocketContext = React.createContext<typeof Socket>(
  socket.connect()
);
