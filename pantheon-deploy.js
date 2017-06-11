/**
 * Deploy contents of ./static to Simplechart Dev Mode plugin on Pantheon
 * SFTP username, password, host, and port can be specified in ./pantheon-config.json
 * or passed from command line. Command line args will override JSON config args.
 *
 * If you just want to test the connection without transferring files, you can
 * use `--test-connection` from the command line or `"testConnection": true` in JSON config
 *
 * node pantheon-deploy.js [--test-connection] [--username=XX] [--password=XX] [--host=XX] [--port=XX]
 */
const fs = require('fs');
const path = require('path');
const Client = require('ssh2-sftp-client');
const args = require('yargs').argv;

const remoteJSPath = './code/wp-content/plugins/simplechart-dev-mode/js';

/**
 * Get CLI args relevant to SFTP connection
 *
 * @return {Object} key-value pairs of SFTP connection info
 */
function getConnectionArgs() {
  return [
    'username',
    'password',
    'host',
    'port',
  ].reduce((acc, key) => {
    if (args[key]) {
      acc[key] = args[key].toString();
    }
    return acc;
  }, {});
}

/**
 * Connect by SFTP and deploy static files
 *
 * @param {Object} config username, password, host, port for SFTP connection
 */
function doDeploy(config) {
  const sftp = new Client();
  sftp.connect(config).then(() => {
    if (args['test-connection'] || config.testConnection) {
      console.log(`Connected to ${config.host}; exiting`);
      process.exit(0);
    }
    console.log('Removing existing JS dir');
    return sftp.rmdir(remoteJSPath, true);
  }).then(() => {
    console.log('Creating empty JS dir');
    return sftp.mkdir(remoteJSPath);
  }).then(() => {
    const localFiles = fs.readdirSync(path.join(__dirname, 'static'))
    localFiles.forEach((filename) => {
      console.log(`Uploading ${filename}`);
      sftp.put(
        path.join(__dirname, 'static', filename),
        path.join(remoteJSPath, filename)
      ).then(() => {
        return sftp.list(remoteJSPath);
      }).then((list) => {
        // Exit when all files are uploaded
        if (list.length === localFiles.length) {
          console.log('Uploaded files:');
          console.log(list.map(({ name }) => name));
          process.exit(0);
        }
      });
    });
  }).catch((err) => {
      console.log(err);
      process.exit(1);
  });
}

/**
 * Check for patheon-config.json then proceed with deploy
 */
fs.readFile(path.join(__dirname, 'pantheon-config.json'), 'utf8', (err, data) => {
  const config = ! err ? JSON.parse(data) : {};
  doDeploy(Object.assign(config, getConnectionArgs()));
});
