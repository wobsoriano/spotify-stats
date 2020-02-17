import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const UnauthenticatedRoute = ({ component: Component, appProps, ...rest }) => {
	return (
		<Route
			{...rest}
			render={props =>
				!appProps.isAuthenticated ? (
					<Component {...props} {...appProps} />
				) : (
					<Redirect to="/top-artists" />
				)
			}
		/>
	);
};

export default UnauthenticatedRoute;
