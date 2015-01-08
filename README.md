Always
=========

Simple Node JS Promise pattern modeled loosely after jQuery. While not exactly as useful as callbacks, I have found circumstances in which this was handy both on the client and server side.

## Installation

  npm install always --save

## Usage

  ```
  var always = require('always'),
      Promise = new always.Promise();

  console.log('always', always, 'Promise', Promise);
  
  function My_Read_File_Function(f) {
    var p = new always.Promise();
    fs.readFile(f, function (err, data) {
      if (err) {
        p.failed(err);
      } else {
        p.resolved(data);
      }
    });
    return p;
  }

  function My_Need_To_Know_Function () {
    My_Read_File_Function('/my/file.js').done(function (result) {
      console.log('File read success!', result);
    }).fail(function (err) {
      console.log('File read failure', err);
    }).always(function (resp) {
      console.log('This always happens...', resp);
    });
  }
  ```

## Tests

  npm test

## Release History

* 0.1.0 Initial release