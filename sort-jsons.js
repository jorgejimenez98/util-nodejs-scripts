// Import the fs module with promises
const fs = require('fs/promises');

// Function to sort a JSON object by key
const sortObjectByKey = (json) => {
  return Object.keys(json).sort().reduce((obj, key) => {
    if (typeof json[key] === 'object') {
      obj[key] = sortObjectByKey(json[key]);
    } else {
      obj[key] = json[key];
    }
    return obj;
  }, {});
};

// Read the contents of the 'locales' folder in the 'public' directory
fs.readdir('./public/locales').then((dirs) => {
  // Iterate over each directory in 'locales'
  dirs.forEach((dir) => {
    // Read the content of the common JSON file in each directory
    const json = require('./public/locales/' + dir + '/common.json');
    
    // Sort the JSON object by key
    const sorted = sortObjectByKey(json);

    // Write the sorted JSON back to the same file
    fs.writeFile('./public/locales/' + dir + '/common.json', JSON.stringify(sorted, null, 2) + '\n', 'utf-8');
  });
});
