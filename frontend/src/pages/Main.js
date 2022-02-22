import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import like from '../assets/like.svg';
import dislike from '../assets/dislike.svg';
import './Main.css';
import api from '../services/api';

export default function Main() {
	let params = useParams();
	const [users, setUsers] = useState([]);

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
		</div>
	);
}
