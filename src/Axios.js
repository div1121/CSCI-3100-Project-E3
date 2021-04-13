import axios from 'axios';

const instance = axios.create({
	baseURL: "https://magic-maze-backend.herokuapp.com",
})

export default instance;