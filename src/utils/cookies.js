export const cookies= {
	getCookie(name) {
		let cookieValue = null;
		if (document.cookie && document.cookie !== '') {

			let cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
				let cookie = cookies[i].trim();
				// Does this cookie string begin with the name we want?
				if (cookie.substring(0, name.length + 1) === (name + '=')) {
					cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	},
	setCookie(name, value, options) {
		options = options || {};

		let expires = options.expires;
		if (typeof expires === "number" && expires) {
			let d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}
		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}
		value = encodeURIComponent(value);
		let updatedCookie = name + "=" + value;

		for (let propName in options) {
			updatedCookie += "; " + propName;
			let propValue = options[propName];
			if (propValue !== true) {
				updatedCookie += "=" + propValue;
			}
		}

		updatedCookie += ';path=/';
		document.cookie = updatedCookie;
	},
	deleteCookie(name) {
		let cookies = document.cookie.split(';')
		cookies.forEach((cookie, index) => {
			if (cookie.includes(`${name}=`)){
				cookies.splice(index, 1)
			}
		})
		document.cookie = cookies.join(';')
	},
	getUrlVar(url, name) {
		let hash;
		let hashes = url.slice(url.indexOf('?') + 1).split('&');
		for(let i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			if(name === hash[0]){
				return hash[1];
			}
		}
		return null;
	}
}
