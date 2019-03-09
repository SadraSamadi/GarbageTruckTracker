import url from 'url';

const opts = __DEV__ ? {
	protocol: 'http',
	hostname: '10.0.2.2',
	port: 3303
} : {
	protocol: 'https',
	hostname: 'garbage-truck-tracker.localtunnel.me'
};

export default {
	defaultUrl: url.format(opts)
};
