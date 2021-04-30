// all source file using the same web socket
import io from 'socket.io-client';
import {PATH_TO_BACKEND} from './baseURL';
const ws = io(PATH_TO_BACKEND);
export default ws;