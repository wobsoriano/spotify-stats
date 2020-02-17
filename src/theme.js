import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

let darkTheme = createMuiTheme({
	palette: {
		type: 'dark',
	},
});

darkTheme = responsiveFontSizes(darkTheme);

export default darkTheme;
