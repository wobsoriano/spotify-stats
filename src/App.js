import React from 'react';
import { AppProvider } from './contexts/AppContext';
import Routes from './routes';

const App = () => {
	return (
		<AppProvider>
			<Routes />
		</AppProvider>
	);
};

export default App;
