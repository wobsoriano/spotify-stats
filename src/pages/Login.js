import React, { useEffect, useState } from 'react';
import {
	setLocalAccessToken,
	setLocalRefreshToken,
	checkAuth,
} from '../spotify';
import { Typography, Grid, Button, Box, makeStyles } from '@material-ui/core';
import Logo from '../assets/react.svg';
import { parseHashBangArgs } from '../utils';
import config from '../config';

const useStyles = makeStyles(theme => ({
	content: {
		flexGrow: 1,
	},
}));

const Login = () => {
	const [buttonText, setButtonText] = useState('LOGIN WITH SPOTIFY');
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		const { error, access_token, refresh_token } = parseHashBangArgs(
			window.location.hash
		);

		if (error && error === 'invalid_token') return;

		if (error && error === 'state_mismatch') return;

		if (access_token) {
			setButtonText('Please wait...');
			setDisabled(true);
			setLocalAccessToken(access_token);
			setLocalRefreshToken(refresh_token);
			// Check also if token is legit
			const fetchLogged = async () => {
				try {
					await checkAuth();
					window.location.reload();
				} catch (e) {
					// token is not legit
					setDisabled(false);
					return;
				}
			};
			fetchLogged();
		}
	}, []);

	const classes = useStyles();
	return (
		<Box className={classes.content}>
			<Grid
				container
				spacing={2}
				direction="column"
				alignItems="center"
				justify="center"
				style={{ minHeight: '80vh' }}
			>
				<Grid item>
					<img src={Logo} alt="logo" style={{ width: '100%' }} />
				</Grid>
				<Grid item>
					<Typography
						variant="h4"
						style={{ textAlign: 'center', fontWeight: 'bold' }}
					>
						Spotify Stats
					</Typography>
				</Grid>
				<Grid item>
					<Typography variant="h6" style={{ textAlign: 'center' }}>
						Your Most Listened to Artists and Songs on Spotify.
					</Typography>
				</Grid>
				<Grid item>
					<Button
						disabled={disabled}
						size="large"
						variant="outlined"
						href={`${config.backendUrl}/login`}
					>
						{buttonText}
					</Button>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Login;
