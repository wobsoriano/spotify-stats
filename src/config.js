const config = {
	backendUrl:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:9000/.netlify/functions/app'
			: 'https://spotify-stats-server.netlify.com/.netlify/functions/app',
};

export default config;
