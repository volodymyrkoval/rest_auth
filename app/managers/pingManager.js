import config from 'config'
import ping from 'tcp-ping'

function getPingTime(hostname = null) {
  return new Promise((resolve, reject) => {
    let options = {
      address: hostname || config.latency.host,
      attempts: config.latency.pingAttempts
    };
    ping.ping(options, function (err, data) {
      if (err) return reject(err);
      resolve(data.avg);
    });
  })
}

export default getPingTime;