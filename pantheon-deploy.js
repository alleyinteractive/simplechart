const fs = require('fs');
const path = require('path');
const Client = require('ssh2-sftp-client');
const args = require('yargs').argv;

const remoteJSPath = './code/wp-content/plugins/simplechart-dev-mode/js';

function doDeploy(config) {
  [
    'username',
    'password',
    'host',
    'port',
  ].forEach((key) => {
    if (args[key]) {
      config[key] = args[key].toString() || '';
    }
  });

  const sftp = new Client();
  sftp.connect(config).then(() => {
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
        if (list.length === localFiles.length) {
          console.log('Uploaded files:');
          console.log(list.map(({ name }) => name));
          process.exit(0);
        }
      });
    });
  }).catch((err) => {
      console.log(err);
      process.exit(0);
  });
}

fs.readFile(path.join(__dirname, 'pantheon-config.json'), 'utf8', (err, data) => {
  const config = ! err ? JSON.parse(data) : {};
  doDeploy(config);
});
