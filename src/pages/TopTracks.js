import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Container,
	Typography,
	Avatar,
	Box,
	List,
	Divider,
	ListItem,
	ListItemText,
	ListItemAvatar,
	ListItemSecondaryAction,
	Tabs,
	Tab,
	Grid,
	Button,
	Hidden,
} from '@material-ui/core';
import { spotify } from '../spotify';
import { millisToMinutesAndSeconds, parseQueryParams } from '../utils';
import { AppContext } from '../contexts/AppContext';
import PlaylistCreator from '../components/PlaylistCreator';

const useStyles = makeStyles(theme => ({
	list: {
		width: '100%',
	},
	header: {
		marginBottom: theme.spacing(1),
	},
	title: {
		fontWeight: 'bold',
	},
	tabs: {
		backgroundColor: theme.palette.action.active,
	},
	buttons: {
		marginTop: theme.spacing(3),
	},
}));

const TopTracks = ({ history }) => {
	const classes = useStyles();
	const [tracks, setTracks] = useState([]);
	const [selectedTab, setSelectedTab] = useState('long_term');
	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState('');
	const [hideLoadMore, setHideLoadmore] = useState(false);
	const [loadMoreText, setLoadMoreText] = useState('Load More');
	const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);
	const { isLoading, setIsLoading } = useContext(AppContext);

	const handleChange = (_, newValue) => {
		setSelectedTab(newValue);
	};

	const fetchMoreTracks = async () => {
		setLoadMoreText('Loading...');
		setLoadMoreDisabled(true);
		try {
			const res = await spotify().getMyTopTracks({
				time_range: selectedTab,
				limit,
				offset,
			});

			if (res.next) {
				const q = parseQueryParams(res.next);
				setOffset(+q.get('offset'));
				setLimit(+q.get('limit'));
			} else {
				setHideLoadmore(true);
			}

			setTracks([...tracks, ...res.items]);
		} catch (e) {
			console.error(e);
		}
		setLoadMoreText('Load More');
		setLoadMoreDisabled(false);
	};

	useEffect(() => {
		async function fetchTopTracks() {
			try {
				const res = await spotify().getMyTopTracks({
					time_range: selectedTab,
					limit: 20,
				});
				setTracks(res.items);
				if (res.next) {
					const q = parseQueryParams(res.next);
					setOffset(+q.get('offset'));
					setLimit(+q.get('limit'));
					setHideLoadmore(false);
				} else {
					setHideLoadmore(true);
				}
			} catch (e) {
				console.error(e);
			}
			setIsLoading(false);
		}
		fetchTopTracks();
	}, [selectedTab, setIsLoading]);

	return (
		<React.Fragment>
			{!isLoading && (
				<Container maxWidth="lg">
					{/* Page Title and Tabs */}
					<Box className={classes.header}>
						<Grid
							container
							direction="row"
							alignItems="flex-start"
							justify="space-between"
						>
							<Grid item>
								<Typography variant="h4" className={classes.title}>
									Top Tracks
								</Typography>
							</Grid>
							<Grid item>
								<Tabs
									value={selectedTab}
									indicatorColor="primary"
									onChange={handleChange}
									aria-label="tabs"
									classes={{ indicator: classes.tabs }}
									variant="fullWidth"
								>
									<Tab label="All Time" value="long_term" />
									<Tab label="Last 6 months" value="medium_term" />
									<Tab label="Last 4 weeks" value="short_term" />
								</Tabs>
							</Grid>
						</Grid>
					</Box>

					{/* Top Tracks List */}
					<List className={classes.list}>
						{tracks.map((track, idx) => {
							return (
								<Box key={track.id}>
									<ListItem
										alignItems="flex-start"
										button
										onClick={() => history.push(`/track/${track.id}`)}
									>
										<ListItemAvatar>
											<Avatar
												alt="Remy Sharp"
												src={track.album.images[2].url}
											/>
										</ListItemAvatar>
										<ListItemText
											primary={track.name}
											secondary={
												<React.Fragment>
													{track.album.artists[0].name} · {track.album.name}
												</React.Fragment>
											}
										/>
										<ListItemSecondaryAction>
											{millisToMinutesAndSeconds(track.duration_ms)}
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

					{/* Load More Button */}
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
											onClick={() => fetchMoreTracks()}
										>
											{loadMoreText}
										</Button>
									</Hidden>
									<Hidden smDown>
										<Button
											variant="outlined"
											onClick={() => fetchMoreTracks()}
											disabled={loadMoreDisabled}
										>
											{loadMoreText}
										</Button>
									</Hidden>
								</Grid>
							</Grid>
						</Box>
					)}

					{/* Playlist Button Creator */}
					<PlaylistCreator
						title="Create Your Top Tracks Playlist"
						message={`This creates a playlist from your ${tracks.length} Top tracks.`}
						trackUris={tracks.map(i => i.uri)}
					/>
				</Container>
			)}
		</React.Fragment>
	);
};

export default TopTracks;
