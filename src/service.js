import io from 'socket.io-client';
const ws = io("https://magic-maze-backend.herokuapp.com");
export default ws;