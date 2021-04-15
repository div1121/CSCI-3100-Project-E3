import axios from 'axios';
import {PATH_TO_BACKEND} from './baseURL';

const instance = axios.create({
	baseURL: PATH_TO_BACKEND,
})

export default instance;