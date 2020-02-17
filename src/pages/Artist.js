import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Avatar, Grid, Button } from '@material-ui/core';
import { spotify } from '../spotify';
import { titleCase } from '../utils';
import grey from '@material-ui/core/colors/grey';
import { AppContext } from '../contexts/AppContext';

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '100vh',
	},
	name: {
		marginTop: theme.spacing(4),
		fontWeight: 'bold',
	},
	followingBtn: {
		marginTop: theme.spacing(4),
	},
	avatar: {
		width: 320,
		height: 320,
		[theme.breakpoints.down('sm')]: {
			width: 180,
			height: 180,
		},
	},
	stat: {
		fontWeight: 'bold',
		textAlign: 'center',
	},
	statTitle: {
		color: grey[500],
		textAlign: 'center',
	},
}));

const Artist = ({ match }) => {
	const [artist, setArtist] = useState({
		name: '',
		followers: {
			total: 0,
		},
		genres: [],
		popularity: 0,
		images: [],
		id: '',
	});
	const [isFollowing, setIsFollowing] = useState(false);
	const { isLoading, setIsLoading } = useContext(AppContext);

	useEffect(() => {
		async function fetchArtist() {
			try {
				const data = await spotify().getArtist(match.params.id);
				setArtist(data);
				const [following] = await spotify().isFollowingArtists([
					match.params.id,
				]);
				setIsFollowing(following);
			} catch (e) {}
			setIsLoading(false);
		}
		fetchArtist();
	}, [match.params.id, setIsLoading]);

	const toggleFollow = async () => {
		try {
			if (isFollowing) {
				await spotify().unfollowArtists([artist.id]);
				setIsFollowing(false);
			} else {
				await spotify().followArtists([artist.id]);
				setIsFollowing(true);
			}
		} catch (e) {}
	};

	const classes = useStyles();
	return (
		<React.Fragment>
			{!isLoading && (
				<Grid
					container
					spacing={2}
					direction="column"
					alignItems="center"
					justify="center"
					style={{ minHeight: '80vh' }}
				>
					<Grid item>
						{artist.images.length > 0 && (
							<Avatar
								alt="Remy Sharp"
								src={artist.images[1].url}
								className={classes.avatar}
							/>
						)}
					</Grid>
					<Grid item>
						<Typography variant="h3" gutterBottom className={classes.name}>
							{artist.name}
						</Typography>
					</Grid>
					<Grid item>
						<Grid container spacing={2}>
							<Grid item xs={4}>
								<Typography variant="h5" className={classes.stat}>
									{artist.followers.total.toLocaleString()}
								</Typography>
								<Typography variant="subtitle1" className={classes.statTitle}>
									Followers
								</Typography>
							</Grid>
							<Grid item xs={4}>
								{artist.genres.map(genre => {
									return (
										<Typography
											key={genre}
											variant="h5"
											className={classes.stat}
										>
											{titleCase(genre)}
										</Typography>
									);
								})}
								<Typography variant="subtitle1" className={classes.statTitle}>
									Genres
								</Typography>
							</Grid>
							<Grid item xs={4}>
								<Typography variant="h5" className={classes.stat}>
									{artist.popularity}%
								</Typography>
								<Typography variant="subtitle1" className={classes.statTitle}>
									Popularity
								</Typography>
							</Grid>
						</Grid>
					</Grid>
					<Grid item>
						<Button
							variant="outlined"
							size="large"
							className={classes.followingBtn}
							onClick={toggleFollow}
						>
							{isFollowing ? 'Following' : 'Follow'}
						</Button>
					</Grid>
				</Grid>
			)}
		</React.Fragment>
	);
};

export default Artist;
