import axios from 'axios';
import {PATH_TO_BACKEND} from './baseURL';

//Axios library is used to make HTTP requests
const instance = axios.create({
	baseURL: PATH_TO_BACKEND,
})

export default instance;