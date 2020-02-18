import React, { useContext, useEffect } from 'react';
import {
	AppBar,
	Divider,
	Drawer,
	Hidden,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Box,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import MicIcon from '@material-ui/icons/Mic';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import HistoryIcon from '@material-ui/icons/History';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter, Link, useLocation } from 'react-router-dom';
import { useLastLocation } from 'react-router-last-location';
import { AppContext } from '../contexts/AppContext';
import { logout } from '../spotify';
import Loader from './Loader';
import config from '../config';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
	},
	drawer: {
		[theme.breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appBar: {
		[theme.breakpoints.up('sm')]: {
			width: `calc(100% - ${drawerWidth}px)`,
			marginLeft: drawerWidth,
		},
	},
	menuButton: {
		marginRight: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			display: 'none',
		},
	},
	toolbar: theme.mixins.toolbar,
	title: {
		flexGrow: 1,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
		[theme.breakpoints.only('xs')]: {
			paddingLeft: theme.spacing(1),
			paddingRight: theme.spacing(1),
		},
	},
	logout: {
		[theme.breakpoints.only('xs')]: {
			display: 'none',
		},
	},
	loader: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '80vh',
	},
	backButton: {
		marginRight: theme.spacing(2),
	},
	forwardButton: {
		marginRight: theme.spacing(2),
	},
	grow: {
		flexGrow: 1,
	},
}));

const routes = [
	{ name: 'Top Artists', path: '/top-artists', icon: <MicIcon /> },
	{ name: 'Top Tracks', path: '/top-tracks', icon: <MusicNoteIcon /> },
	{ name: 'Recently Played', path: '/recently-played', icon: <HistoryIcon /> },
];

function ResponsiveDrawer(props) {
	const { container } = props;
	const classes = useStyles();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const { isLoading, setIsLoading } = useContext(AppContext);
	const lastLocation = useLastLocation();

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const location = useLocation();

	useEffect(() => {
		if (!lastLocation || lastLocation.pathname !== location.pathname) {
			setIsLoading(true); // Set it to false per route after async action
		}

		setMobileOpen(false);
	}, [lastLocation, location, setIsLoading]);

	const drawer = (
		<div>
			<Box style={{ padding: 10, textAlign: 'center' }}>
				<img
					alt="logo"
					src={require('../assets/spotify.png')}
					style={{ width: '40%' }}
				/>
			</Box>
			{/* <div className={classes.toolbar} /> */}
			<Divider />
			<List>
				{routes.map((route, index) => (
					<ListItem
						component={Link}
						button
						key={index}
						selected={props.location.pathname === route.path}
						to={route.path}
					>
						<ListItemIcon>{route.icon}</ListItemIcon>
						<ListItemText primary={route.name} />
					</ListItem>
				))}
				<Hidden smUp>
					<ListItem onClick={() => logout()} button>
						<ListItemIcon>
							<ExitToAppIcon />
						</ListItemIcon>
						<ListItemText primary="Log out" />
					</ListItem>
				</Hidden>
			</List>
		</div>
	);

	const isRootRoute = routes.map(i => i.path).includes(location.pathname);

	return (
		<div className={classes.root}>
			<AppBar position="fixed" className={classes.appBar} color="default">
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						className={classes.menuButton}
					>
						<MenuIcon />
					</IconButton>
					<Hidden smDown>
						<IconButton
							color="inherit"
							aria-label="Back"
							edge="start"
							onClick={() => props.history.goBack()}
							disabled={isRootRoute}
							className={classes.backButton}
						>
							<ArrowBackIosIcon />
						</IconButton>
						<IconButton
							color="inherit"
							aria-label="Forward"
							edge="start"
							onClick={() => props.history.goForward()}
							className={classes.forwardButton}
						>
							<ArrowForwardIosIcon />
						</IconButton>
					</Hidden>
					<div className={classes.grow} />
					<Button color="inherit" href={config.repoUrl} target="_BLANK">
						GitHub
					</Button>
					<Button
						color="inherit"
						onClick={() => logout()}
						className={classes.logout}
					>
						Log out
					</Button>
				</Toolbar>
			</AppBar>
			<nav className={classes.drawer} aria-label="mics notes histories">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Hidden smUp implementation="css">
					<Drawer
						container={container}
						variant="temporary"
						open={mobileOpen}
						onClose={handleDrawerToggle}
						classes={{
							paper: classes.drawerPaper,
						}}
						ModalProps={{
							keepMounted: true, // Better open performance on mobile.
						}}
					>
						{drawer}
					</Drawer>
				</Hidden>
				<Hidden xsDown implementation="css">
					<Drawer
						classes={{
							paper: classes.drawerPaper,
						}}
						variant="permanent"
						open
					>
						{drawer}
					</Drawer>
				</Hidden>
			</nav>
			<main className={classes.content}>
				<div className={classes.toolbar} />
				{isLoading && (
					<Box className={classes.loader}>
						<Loader />
					</Box>
				)}
				{props.children}
			</main>
		</div>
	);
}

export default withRouter(ResponsiveDrawer);
