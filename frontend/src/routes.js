import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Main from './pages/Main';

export default function Routers() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/dev/:useId" element={<Main />} />
			</Routes>
		</BrowserRouter>
	);
}
