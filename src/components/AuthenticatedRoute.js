import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import ResponsiveDrawer from './ResponsiveDrawer';

const AuthenticatedRoute = ({ component: Component, appProps, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props =>
				appProps.isAuthenticated ? (
					<ResponsiveDrawer>
						<Component {...props} {...appProps} />
					</ResponsiveDrawer>
				) : (
					<Redirect to="/" />
				)
			}
		/>
	);
};

export default AuthenticatedRoute;
