import config from 'config';

export default function (e) {
  if (config.debug) {
    console.log(['-'.repeat(20), new Date(), e].join('/n'));
  }
}