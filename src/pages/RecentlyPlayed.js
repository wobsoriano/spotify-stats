import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { spotify } from '../spotify';
import { millisToMinutesAndSeconds, parseQueryParams } from '../utils';
import { AppContext } from '../contexts/AppContext';
import {
	Tooltip,
	Box,
	Fab,
	Typography,
	Avatar,
	Container,
	ListItem,
	List,
	ListItemAvatar,
	ListItemText,
	ListItemSecondaryAction,
	Divider,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Button,
	Snackbar,
	IconButton,
	Grid,
	Hidden,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	list: {
		width: '100%',
	},
	header: {
		marginBottom: theme.spacing(1),
	},
	fab: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
		backgroundColor: '#1DB954',
		'&:hover': {
			backgroundColor: '#1ED760',
		},
		color: '#fff',
	},
	title: {
		fontWeight: 'bold',
	},
}));

const RecentlyPlayed = ({ history }) => {
	const classes = useStyles();
	const [tracks, setTracks] = useState([]);
	const [dialog, setDialog] = useState(false);
	const [snackbar, setSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [limit, setLimit] = useState(20);
	const [before, setBefore] = useState('');
	const [hideLoadMore, setHideLoadmore] = useState(false);
	const [loadMoreText, setLoadMoreText] = useState('Load More');
	const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);
	const { isLoading, setIsLoading } = useContext(AppContext);

	const fetchMoreRecentlyPlayedTracks = async () => {
		setLoadMoreText('Loading...');
		setLoadMoreDisabled(true);
		try {
			const res = await spotify().getMyRecentlyPlayedTracks({
				limit,
				before,
			});

			if (res.next) {
				const q = parseQueryParams(res.next);
				setBefore(+q.get('before'));
				setLimit(+q.get('limit'));
			} else {
				setHideLoadmore(true);
			}

			setTracks([...tracks, ...res.items]);
		} catch (e) {}
		setLoadMoreText('Load More');
		setLoadMoreDisabled(false);
	};

	useEffect(() => {
		async function fetchTopTracks() {
			try {
				const res = await spotify().getMyRecentlyPlayedTracks({
					limit,
				});
				setTracks(res.items);
				const q = parseQueryParams(res.next);
				setBefore(+q.get('before'));
				setLimit(+q.get('limit'));
				setHideLoadmore(false);
			} catch (e) {}
			setIsLoading(false);
		}
		fetchTopTracks();
	}, [limit, setIsLoading]);

	const createPlaylist = async () => {
		try {
			const today = new Date();
			const month = today.toLocaleString('default', { month: 'long' });
			const user = await spotify().getMe();
			const playlist = await spotify().createPlaylist(user.id, {
				name: `Replay ${
					tracks.length
				} Tracks - ${month} ${today.getFullYear()}`,
			});
			const trackUris = tracks.map(i => i.track.uri);
			const { snapshot_id } = await spotify().addTracksToPlaylist(
				playlist.id,
				trackUris
			);
			console.log(snapshot_id);
			setSnackbarMessage('Playlist has been created');
			setSnackbar(true);
			setDialog(false);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<React.Fragment>
			{!isLoading && (
				<Container maxWidth="lg">
					<Box className={classes.header}>
						<Typography variant="h4" gutterBottom className={classes.title}>
							Recently Played
						</Typography>
					</Box>
					<List className={classes.root}>
						{tracks.map((track, idx) => {
							return (
								<Box key={idx}>
									<ListItem
										alignItems="flex-start"
										onClick={() => history.push(`/track/${track.track.id}`)}
										button
									>
										<ListItemAvatar>
											<Avatar
												alt="Remy Sharp"
												src={track.track.album.images[2].url}
											/>
										</ListItemAvatar>
										<ListItemText
											primary={track.track.name}
											secondary={
												<React.Fragment>
													{track.track.album.artists[0].name} ·{' '}
													{track.track.album.name}
												</React.Fragment>
											}
										/>
										<ListItemSecondaryAction>
											{millisToMinutesAndSeconds(track.track.duration_ms)}
										</ListItemSecondaryAction>
									</ListItem>
									{tracks.length !== idx + 1 ? (
										<Divider variant="inset" component="li" />
									) : (
										''
									)}
								</Box>
							);
						})}
					</List>
					{!hideLoadMore && (
						<Box className={classes.buttons}>
							<Grid
								container
								direction="row"
								alignItems="flex-start"
								justify="center"
							>
								<Grid item>
									<Hidden mdUp>
										<Button
											variant="outlined"
											size="small"
											disabled={loadMoreDisabled}
											onClick={() => fetchMoreRecentlyPlayedTracks()}
										>
											{loadMoreText}
										</Button>
									</Hidden>
									<Hidden smDown>
										<Button
											variant="outlined"
											onClick={() => fetchMoreRecentlyPlayedTracks()}
											disabled={loadMoreDisabled}
										>
											{loadMoreText}
										</Button>
									</Hidden>
								</Grid>
							</Grid>
						</Box>
					)}
					<Tooltip
						title="Create Your Recently Played Playlist"
						placement="left-start"
						aria-label="add"
					>
						<Fab className={classes.fab} onClick={() => setDialog(true)}>
							<AddIcon />
						</Fab>
					</Tooltip>
					<Dialog
						open={dialog}
						aria-labelledby="alert-dialog-title"
						aria-describedby="alert-dialog-description"
					>
						<DialogTitle id="alert-dialog-title">Create Playlist</DialogTitle>
						<DialogContent>
							<DialogContentText id="alert-dialog-description">
								This creates a playlist from your {tracks.length} Recently
								Played tracks.
							</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setDialog(false)}>Cancel</Button>
							<Button onClick={() => createPlaylist()} autoFocus>
								Create
							</Button>
						</DialogActions>
					</Dialog>

					<Snackbar
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={snackbar}
						autoHideDuration={300}
						message={snackbarMessage}
						action={
							<React.Fragment>
								<IconButton
									size="small"
									aria-label="close"
									color="inherit"
									onClick={() => setSnackbar(false)}
								>
									<CloseIcon fontSize="small" />
								</IconButton>
							</React.Fragment>
						}
					/>
				</Container>
			)}
		</React.Fragment>
	);
};

export default RecentlyPlayed;
