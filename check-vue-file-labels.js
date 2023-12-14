// Import necessary modules
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const compiler = require("vue-template-compiler");

// Base directory of Vue files
const baseDirectory = "resources/js";

// Spanish language file
const langFile = "lang/es.json";

// Pattern to search for Vue files
const vueFilesPattern = path.join(baseDirectory, "/**/*.vue");

// Function to process a Vue file and find translation keys
function processVueFile(filePath) {
  // Read the content of the file
  const fileContent = fs.readFileSync(filePath, "utf-8");
  // Parse the Vue component
  const parsedComponent = compiler.parseComponent(fileContent);

  // Array to store translation keys
  const translationKeys = [];

  // If there is a template in the component
  if (parsedComponent.template) {
    // Compile the template and get the AST
    const templateAst = compiler.compile(parsedComponent.template.content, { preserveWhitespace: false }).ast;
    // Find translation keys in the template AST
    findTranslationKeys(templateAst, translationKeys);
  }

  return translationKeys;
}

// Function to find translation keys in the AST
function findTranslationKeys(ast, translationKeys) {
  function traverse(node) {
    if (node.type === 1) {
      node.children.forEach(traverse);
    } else if (node.type === 2 && node.expression) {
      // Find translation expressions ($t('key'))
      const matches = node.expression.match(/\$t\(['"](.+?)['"]\)/g);
      if (matches) {
        matches.forEach(match => {
          const key = match.match(/\$t\(['"](.+?)['"]\)/)[1];
          translationKeys.push(key);
        });
      }
    } else if (node.type === 3 && node.text.trim() !== "") {
      // Direct text that could be a translation key
      translationKeys.push(node.text.trim());
    }
  }

  traverse(ast);
}

// Main function to analyze all Vue files
function analyzeVueFiles() {
  // Get the list of Vue files
  const vueFiles = glob.sync(vueFilesPattern);

  // Set to store all translation keys and unique keys
  const allTranslationKeys = new Set();
  const uniqueTranslationKeys = new Set();

  // Process each Vue file
  vueFiles.forEach(file => {
    const translationKeys = processVueFile(file);
    translationKeys.forEach(key => uniqueTranslationKeys.add(key));
    translationKeys.forEach(key => allTranslationKeys.add(key));
  });

  return { allTranslationKeys: Array.from(allTranslationKeys), uniqueTranslationKeys: Array.from(uniqueTranslationKeys) };
}

// Function to load existing translation keys from the language file
function loadExistingKeys() {
  try {
    // Read the content of the language file
    const langContent = fs.readFileSync(langFile, "utf-8");
    // Parse the JSON content
    const langData = JSON.parse(langContent);
    // Get existing keys
    return Object.keys(langData);
  } catch (error) {
    console.error("Error loading existing keys:", error);
    return [];
  }
}

// Get unique translation keys from Vue files
const { uniqueTranslationKeys } = analyzeVueFiles();

// Load existing translation keys from the language file
const existingKeys = loadExistingKeys();

// Convert unique and existing keys to arrays
const uniqueTranslationKeysArray = Array.from(uniqueTranslationKeys);

// Create a set of existing keys for easy comparison
const existingKeysSet = new Set(existingKeys);

// Find translation keys that already exist in the language file
const uniqueExistingKeys = uniqueTranslationKeysArray.filter(key => existingKeysSet.has(key));

// Find translation keys that are not in the language file
const missingKeys = uniqueTranslationKeysArray.filter(key => !existingKeysSet.has(key));

// Display results in the console
console.log("-------------------------");
console.log("");
console.log("Unique translation keys found in .vue files:", uniqueTranslationKeysArray);
console.log("");
console.log("-----------------------------------------");
console.log("");
console.log("Translation keys found that already exist in lang/es.json:", uniqueExistingKeys);
console.log("");
console.log("----------------------------------------");
console.log("");
console.log("Translation keys that are not in lang/es.json:", missingKeys);
