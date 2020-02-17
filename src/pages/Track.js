import React, { useState, useEffect, useContext } from 'react';
import { spotify } from '../spotify';
import { makeStyles } from '@material-ui/core/styles';
import {
	Container,
	Typography,
	Avatar,
	Grid,
	Button,
	Box,
} from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import AudioFeaturesChart from '../components/AudioFeaturesChart';
import { AppContext } from '../contexts/AppContext';

const useStyles = makeStyles(theme => ({
	container: {
		alignItems: 'center',
	},
	name: {
		fontWeight: 'bold',
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center',
		},
	},
	avatar: {
		height: '100%',
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			height: 200,
			width: 200,
		},
	},
	gridContainer: {
		[theme.breakpoints.down('sm')]: {
			justifyContent: 'center',
		},
	},
	artist: {
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center',
		},
		marginTop: theme.spacing(0.5),
		fontWeight: 'bold',
		color: grey[500],
	},
	album: {
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center',
		},
		marginTop: theme.spacing(0.5),
		fontWeight: 'bold',
		color: grey[500],
	},
	playButton: {
		marginTop: theme.spacing(4),
	},
	playButtonContainer: {
		[theme.breakpoints.down('sm')]: {
			textAlign: 'center',
		},
	},
}));

const Track = ({ match }) => {
	const [track, setTrack] = useState({
		album: {
			images: [],
			artists: [],
			name: '',
			release_date: '',
		},
		artists: [],
		name: '',
		external_urls: {
			spotify: '',
		},
	});
	const [features, setFeatures] = useState(null);
	const { isLoading, setIsLoading } = useContext(AppContext);

	useEffect(() => {
		async function fetchTrack() {
			try {
				const data = await spotify().getTrack(match.params.id);
				console.log(data);
				setTrack(data);
				const features = await spotify().getAudioFeaturesForTrack(
					match.params.id
				);
				console.log('features', features);
				setFeatures(features);
			} catch (e) {}
			setIsLoading(false);
		}
		fetchTrack();
	}, [match.params.id, setIsLoading]);

	const classes = useStyles();

	return (
		<React.Fragment>
			{!isLoading && (
				<Container maxWidth="lg" className={classes.container}>
					<Grid className={classes.gridContainer} container spacing={4}>
						<Grid item md={4}>
							{track.album.images.length > 0 && (
								<Avatar
									variant="square"
									alt="Remy Sharp"
									className={classes.avatar}
									src={track.album.images[1].url}
								/>
							)}
						</Grid>
						<Grid item md={8}>
							<Typography variant="h3" className={classes.name}>
								{track.name}
							</Typography>
							<Typography
								variant="h5"
								className={classes.artist}
								style={{ color: '#9e9e9e' }}
							>
								{track.album.artists.length > 0
									? track.album.artists[0].name
									: ''}
							</Typography>
							<Typography
								variant="body1"
								className={classes.album}
								style={{ color: '#9e9e9e' }}
							>
								{track.album.name} · {track.album.release_date.split('-')[0]}
							</Typography>
							<Box className={classes.playButtonContainer}>
								<Button
									startIcon={<PlayArrowIcon />}
									variant="outlined"
									href={track.external_urls.spotify}
									target="_BLANK"
									className={classes.playButton}
								>
									PLAY ON SPOTIFY
								</Button>
							</Box>
						</Grid>
						<Grid item md={12}>
							<Typography variant="h5" gutterBottom>
								Audio Features
							</Typography>
							{features && <AudioFeaturesChart features={features} />}
						</Grid>
					</Grid>
				</Container>
			)}
		</React.Fragment>
	);
};

export default Track;
