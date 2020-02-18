import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { spotify } from '../spotify';
import { millisToMinutesAndSeconds, parseQueryParams } from '../utils';
import { AppContext } from '../contexts/AppContext';
import {
	Typography,
	Avatar,
	Container,
	ListItem,
	List,
	ListItemAvatar,
	ListItemText,
	ListItemSecondaryAction,
	Divider,
	Button,
	Grid,
	Box,
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
				</Container>
			)}
		</React.Fragment>
	);
};

export default RecentlyPlayed;
