export const millisToMinutesAndSeconds = millis => {
	const minutes = Math.floor(millis / 60000);
	const seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export const titleCase = str => {
	var splitStr = str.toLowerCase().split(' ');
	for (var i = 0; i < splitStr.length; i++) {
		// You do not need to check if i is larger than splitStr length, as your for does that for you
		// Assign it back to the array
		splitStr[i] =
			splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	// Directly return the joined string
	return splitStr.join(' ');
};

/**
 * Parse hash bang parameters from a URL as key value object.
 *
 * For repeated parameters the last parameter is effective.
 *
 * If = syntax is not used the value is set to null.
 *
 * #x&y=3 -> { x:null, y:3 }
 *
 * @param aURL URL to parse or null if window.location is used
 *
 * @return Object of key -> value mappings.
 */
export const parseHashBangArgs = aURL => {
	aURL = aURL || window.location.href;

	var vars = {};
	var hashes = aURL.slice(aURL.indexOf('#') + 1).split('&');

	for (var i = 0; i < hashes.length; i++) {
		var hash = hashes[i].split('=');

		if (hash.length > 1) {
			vars[hash[0]] = hash[1];
		} else {
			vars[hash[0]] = null;
		}
	}

	return vars;
};

export const parseQueryParams = aURL => {
	const url = new URL(aURL);
	return url.searchParams;
};
