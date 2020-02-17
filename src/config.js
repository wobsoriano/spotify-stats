const config = {
	backendUrl:
		process.env.NODE_ENV === 'development'
			? 'http://localhost:9000/.netlify/functions/app'
			: 'https://spotify-lambda.netlify.com/.netlify/functions/app/login',
};

export default config;
