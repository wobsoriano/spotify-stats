import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { LastLocationProvider } from 'react-router-last-location';
import Login from '../pages/Login';
import TopArtists from '../pages/TopArtists';
import TopTracks from '../pages/TopTracks';
import RecentlyPlayed from '../pages/RecentlyPlayed';
import Track from '../pages/Track';
import Artist from '../pages/Artist';
import AuthenticatedRoute from '../components/AuthenticatedRoute';
import UnauthenticatedRoute from '../components/UnauthenticatedRoute';
import { checkAuth } from '../spotify';

const Routes = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);

	useEffect(() => {
		const fetchLogged = async () => {
			try {
				await checkAuth();
				setIsAuthenticated(true);
			} catch (e) {
				setIsAuthenticated(false);
			}
		};

		fetchLogged();
	}, []);

	if (isAuthenticated === null) {
		return <></>;
	}

	return (
		<Router>
			<LastLocationProvider>
				<Switch>
					<UnauthenticatedRoute
						path="/"
						exact
						component={Login}
						appProps={{ isAuthenticated }}
					/>
					<AuthenticatedRoute
						path="/top-artists"
						component={TopArtists}
						appProps={{ isAuthenticated }}
					/>
					<AuthenticatedRoute
						path="/top-tracks"
						component={TopTracks}
						appProps={{ isAuthenticated }}
					/>
					<AuthenticatedRoute
						path="/recently-played"
						component={RecentlyPlayed}
						appProps={{ isAuthenticated }}
					/>
					<AuthenticatedRoute
						path="/track/:id"
						component={Track}
						appProps={{ isAuthenticated }}
					/>
					<AuthenticatedRoute
						path="/artist/:id"
						component={Artist}
						appProps={{ isAuthenticated }}
					/>
				</Switch>
			</LastLocationProvider>
		</Router>
	);
};

export default Routes;
