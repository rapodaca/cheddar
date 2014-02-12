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