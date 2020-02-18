import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
	Container,
	Typography,
	Grid,
	Box,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Tab,
	Tabs,
	Button,
	Hidden,
} from '@material-ui/core';
import { spotify } from '../spotify';
import { AppContext } from '../contexts/AppContext';
import { parseQueryParams } from '../utils';

const useStyles = makeStyles(theme => ({
	icon: {
		marginRight: theme.spacing(2),
	},
	card: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
	},
	cardMedia: {
		paddingTop: '56.25%',
		height: 160,
	},
	cardContent: {
		flexGrow: 1,
	},
	header: {
		marginBottom: theme.spacing(4),
	},
	title: {
		fontWeight: 'bold',
	},
	artistName: {
		fontWeight: 'bold',
	},
	tabs: {
		backgroundColor: theme.palette.action.active,
	},
	buttons: {
		marginTop: theme.spacing(3),
	},
}));

const TopArtists = ({ history }) => {
	const classes = useStyles();
	const [artists, setArtists] = useState([]);
	const [limit, setLimit] = useState(20);
	const [offset, setOffset] = useState('');
	const [hideLoadMore, setHideLoadmore] = useState(false);
	const [loadMoreText, setLoadMoreText] = useState('Load More');
	const [loadMoreDisabled, setLoadMoreDisabled] = useState(false);
	const { isLoading, setIsLoading } = useContext(AppContext);

	const [selectedTab, setSelectedTab] = useState('long_term');

	const handleChange = (_, newValue) => {
		setSelectedTab(newValue);
	};

	const fetchMoreArtists = async () => {
		setLoadMoreText('Loading...');
		setLoadMoreDisabled(true);
		try {
			const res = await spotify().getMyTopArtists({
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

			setArtists([...artists, ...res.items]);
		} catch (e) {}
		setLoadMoreText('Load More');
		setLoadMoreDisabled(false);
	};

	useEffect(() => {
		async function fetchTopArtists() {
			try {
				const res = await spotify().getMyTopArtists({
					time_range: selectedTab,
					limit,
				});
				setArtists(res.items);
				if (res.next) {
					const q = parseQueryParams(res.next);
					setOffset(+q.get('offset'));
					setLimit(+q.get('limit'));
					setHideLoadmore(false);
				} else {
					setHideLoadmore(true);
				}
			} catch (e) {}
			setIsLoading(false);
		}
		fetchTopArtists();
	}, [limit, selectedTab, setIsLoading]);

	return (
		<React.Fragment>
			{!isLoading && (
				<Container maxWidth="lg">
					<Box className={classes.header}>
						<Grid
							container
							direction="row"
							alignItems="flex-start"
							justify="space-between"
						>
							<Grid item>
								<Typography variant="h4" className={classes.title}>
									Top Artists
								</Typography>
							</Grid>
							<Grid item>
								<Tabs
									value={selectedTab}
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
					<Grid container spacing={4}>
						{artists.map(artist => (
							<Grid item key={artist.id} xs={12} sm={6} md={3}>
								<Card
									className={classes.card}
									onClick={() => history.push(`/artist/${artist.id}`)}
								>
									<CardActionArea>
										<CardMedia
											image={artist.images[1].url}
											className={classes.cardMedia}
											title="Image title"
										/>
										<CardContent className={classes.cardContent}>
											<Typography
												variant="subtitle1"
												className={classes.artistName}
											>
												{artist.name}
											</Typography>
										</CardContent>
									</CardActionArea>
								</Card>
							</Grid>
						))}
					</Grid>
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
											onClick={() => fetchMoreArtists()}
										>
											{loadMoreText}
										</Button>
									</Hidden>
									<Hidden smDown>
										<Button
											variant="outlined"
											onClick={() => fetchMoreArtists()}
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

export default TopArtists;
