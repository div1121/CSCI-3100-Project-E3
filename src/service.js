import io from 'socket.io-client';
//const ws = io("http://localhost:9000");
const ws = io("https://magic-maze-backend.herokuapp.com");
export default ws;