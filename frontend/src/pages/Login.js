import { React, useState } from 'react';
import logo from '../assets/logo.svg';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
	const [username, setUsername] = useState('');
	const navigate = useNavigate();

	async function handleSubmit(e) {
		e.preventDefault();

		const response = await api.post('/devs', { username });

		const { _id } = response.data;

		navigate(`/dev/${_id}`);
	}

	//TODO: lidar com usuarios inexistentes e sem nome
	//FIXME: duplicação de usuario por case sensitive
	return (
		<div className="login-container">
			<form onSubmit={handleSubmit}>
				<img src={logo} alt="Tindev" />
				<input
					value={username}
					onChange={e => setUsername(e.target.value)}
					placeholder="Use your Github User"
				/>
				<button type="submit">Login</button>
			</form>
		</div>
	);
}
