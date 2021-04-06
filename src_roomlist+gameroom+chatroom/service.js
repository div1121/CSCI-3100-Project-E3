import io from 'socket.io-client';
const ws = io("http://localhost:8000");
export default ws;