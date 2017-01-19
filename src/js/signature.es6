/* eslint-disable */
const styles = {
  blue: 'background-color: #2fb0e6; color: #2fb0e6;',
  'clear-blue': 'background-color: #aae4f7; color: #aae4f7;',
  white: 'background-color: white; color: white;',
  text: 'background-color: white; color: #2fb0e6;'
};

const drawing = [
  [' ', 'blue', 17],
  ['\n', 'text'],
  [' ', 'blue', 2],
  [' ', 'clear-blue', 2],
  [' ', 'blue', 9],
  [' ', 'white', 2],
  [' ', 'blue', 2],
  ['\n', 'text'],
  [' ', 'blue', 4],
  [' ', 'clear-blue', 2],
  [' ', 'blue', 5],
  [' ', 'white', 2],
  [' ', 'blue', 4],
  ['   So, digging into my code huh? :)', 'text'],
  ['\n', 'text'],
  [' ', 'blue', 6],
  [' ', 'clear-blue', 2],
  [' ', 'blue'],
  [' ', 'white', 2],
  [' ', 'blue', 6],
  ['\n', 'text'],
  [' ', 'blue', 6],
  [' ', 'white', 2],
  [' ', 'blue'],
  [' ', 'clear-blue', 2],
  [' ', 'blue', 6],
  ['   Remember, the \'X\' always marks the right spot ;)', 'text'],
  ['\n', 'text'],
  [' ', 'blue', 4],
  [' ', 'white', 2],
  [' ', 'blue', 5],
  [' ', 'clear-blue', 2],
  [' ', 'blue', 4],
  ['\n', 'text'],
  [' ', 'blue', 2],
  [' ', 'white', 2],
  [' ', 'blue', 9],
  [' ', 'clear-blue', 2],
  [' ', 'blue', 2],
  ['\n', 'text'],
  [' ', 'blue', 17]
];

let text = '';
const log = [];

for (let i = 0, len = drawing.length; i < len; ++i) {
  if (drawing[i].length < 3) {
    drawing[i][2] = 1;
  }

  text += '%c';

  for (let j = 0, len2 = drawing[i][2]; j < len2; ++j) {
    text += drawing[i][0];
  }

  log.push(styles[drawing[i][1]]);
}

log.unshift(text);

console.log.apply(this, log);

const elem = document.getElementById('signature');
elem.parentNode.removeChild(elem);
