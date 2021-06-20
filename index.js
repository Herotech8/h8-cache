const path = require('path');
const fs = require('fs');

class Cache {
  constructor() {
    var fullpath = path.normalize(__dirname).replace(/\\/g, "/");
    var parts = fullpath.split('/');

    var name = 'default';

    var options = [
      'stationinterface',
      'droneinterface',
      'commsboxinterface',
      'hybridserver'
    ];

    for(var i in options) {
      var option = options[i];

      if(parts.includes(option)) {
        name = option;
      }
    }

    console.log('[h8-cache]', 'Name: ' + name);

    if(process.platform == 'win32') {
      var dir = 'C:/herotech8';

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      dir += '/cache';

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      dir += '/' + name;

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
    } else {
      var dir = '/home/ubuntu/.cache';

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      dir += '/herotech8';

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }

      dir += '/' + name;

      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
    }

    this.path = dir;

    console.log('[h8-cache]', 'Path: ' + dir);
  }

  get(key, dfault) {
    var filename = key.replace(/\W/g, '') + '.json',
        filepath = this.path + '/' + filename;

    if(!fs.existsSync(filepath)) {
      if(dfault !== undefined) {
        return dfault;
      } else {
        throw "Key not found";
      }
    }

    var content = fs.readFileSync(filepath);

    content = JSON.parse(content);

    return content.value;
  }

  remember(key, value) {
    var filename = key.replace(/\W/g, '') + '.json';

    var content = {
      storedAt: new Date().getTime(),
      type: 'string',
      value: value
    };

    if(value.constructor == [].constructor) {
      content.type = 'array';
    } else if(value.constructor == {}.constructor) {
      content.type = 'object';
    }

    fs.writeFileSync(this.path + '/' + filename, JSON.stringify(content));
  }
  
  forget(key) {
    var filename = key.replace(/\W/g, '') + '.json';

    fs.unlinkSync(this.path + '/' + filename);
  }
}

module.exports = new Cache;
