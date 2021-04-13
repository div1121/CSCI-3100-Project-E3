import io from 'socket.io-client';
const ws = io("http://localhost:9000");
export default ws;