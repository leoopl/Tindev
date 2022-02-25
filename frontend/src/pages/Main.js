import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useParams, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import './Main.css';
import api from '../services/api';
import itsamatch from '../assets/itsamatch.png';

export default function Main() {
	let params = useParams();
	const [users, setUsers] = useState([]);
	const [match, setMatch] = useState(null);

	useEffect(() => {
		async function loadUsers() {
			const response = await api.get('/devs', {
				headers: {
					user: params.useId,
				},
			});
			setUsers(response.data);
		}
		loadUsers();
	}, [params.useId]);

	useEffect(() => {
		const socket = io('http://localhost:3333', {
			query: { user: params.useId },
		});

		socket.on('match', dev => {
			setMatch(dev);
		});
	}, [params.useId]);

	async function handleLike(id) {
		await api.post(`/devs/${id}/likes`, null, { headers: { user: params.useId } });
		setUsers(users.filter(user => user._id !== id));
	}
	async function handleDislike(id) {
		await api.post(`/devs/${id}/dislikes`, null, { headers: { user: params.useId } });
		setUsers(users.filter(user => user._id !== id));
	}

	return (
		<div className="main-container">
			<Link to="/">
				<img src={logo} alt="Tindev" />
			</Link>
			{users.length > 0 ? (
				<ul>
					{users.map(user => (
						<li key={user._id}>
							<img src={user.avatar} alt="" />
							<footer>
								<strong> {user.name} </strong>
								<p>{user.bio}</p>
							</footer>
							<div className="buttons">
								<button type="button" onClick={() => handleDislike(user._id)}>
									<img src={dislike} alt="Dislike" />
								</button>
								<button type="button" onClick={() => handleLike(user._id)}>
									<img src={like} alt="Like" />
								</button>
							</div>
						</li>
					))}
				</ul>
			) : (
				<div className="empty">Acabou :(</div>
			)}
			{match && (
				<div className="match-container">
					<img src={itsamatch} alt="Its a Match" />
					<img className="avatar" src={match.avatar} alt="" />
					<strong>{match.name}</strong>
					<p>{match.bio}</p>

					<button onClick={() => setMatch(null)} type="button">
						Close
					</button>
				</div>
			)}
		</div>
	);
}
