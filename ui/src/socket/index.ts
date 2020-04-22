import io, { Socket } from 'socket.io-client';

const url = process.env.REACT_APP_SOCKET_SERVER_URL || '';

export default {
  connect: function connect(): typeof Socket {
    return io(url);
  }
};
