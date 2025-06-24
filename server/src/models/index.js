const fs = require('fs');
const path = require('path');

const modelsPath = __dirname;

fs.readdirSync(modelsPath).forEach(file => {
  if (
    file.endsWith('.js') &&
    file !== 'index.js'
  ) {
    require(path.join(modelsPath, file));
  }
});