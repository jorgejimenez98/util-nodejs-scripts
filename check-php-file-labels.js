const fs = require("fs");
const path = require("path");

// Function to read PHP files and extract tags
function analyzePhpFile(filePath, labelsSet) {
  const content = fs.readFileSync(filePath, "utf8");
  const regex = /__\(['"]([^'"]+)['"]\)/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    labelsSet.add(match[1]);
  }
}

// Function to analyze files in a directory
function analyzeDirectory(directoryPath, labelsSet) {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      // If it is a directory, call the function recursively
      analyzeDirectory(filePath, labelsSet);
    } else if (path.extname(filePath) === ".php") {
      // If it is a PHP file, call the function to analyze it
      analyzePhpFile(filePath, labelsSet);
    }
  }
}

// Main function to analyze the 'app' directory
function analyzeAppDirectory() {
  const appDirectoryPath = path.join(__dirname, "app");
  const labelsSet = new Set();

  analyzeDirectory(appDirectoryPath, labelsSet);

  // Convert the set to an array to return it
  const labelsArray = Array.from(labelsSet);
  const outputFilePath = path.join(__dirname, "labels.txt");

  // Write the list to a file
  fs.writeFileSync(outputFilePath, labelsArray.join("\n"));

  console.log("List of labels written to:", outputFilePath);
}

// Call the main function
analyzeAppDirectory();
