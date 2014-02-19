/**
 * Cheddar - Bitcoin wallet library for JavaScript
 *
 * Copyright (c) 2014 Richard L. Apodaca
 * All Rights Reserved.
 *
 * Licensed under the MIT License
 * See "LICENSE" for details.
 *
 * @author Richard L. Apodaca <rich.apodaca@gmail.com>
 */

desc('Run Jasmine tests');
task('spec', function() {
  var command = 'NODE_PATH=lib node_modules/.bin/jasmine-node spec --color --forceexit';

  console.log(command);
  jake.exec(command, { printStdout: true } , complete);
}, true);

desc('Run spec suite when file changes');
task('autospec', function() {
  var command = 'NODE_PATH=lib node_modules/.bin/jasmine-node spec --color --autotest --watch lib';

  console.log(command);
  jake.exec(command, { printStdout: true }, complete);
}, true);

desc('Run Jasmine functional tests');
task('functional', function() {
  var command = 'NODE_PATH=lib node_modules/.bin/jasmine-node functional --color --forceexit';

  console.log(command);
  jake.exec(command, { printStdout: true } , complete);
}, true);