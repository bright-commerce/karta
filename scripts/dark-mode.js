const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /(?<!dark:)bg-white/g, replacement: 'bg-white dark:bg-gray-900' },
  { regex: /(?<!dark:)bg-gray-50/g, replacement: 'bg-gray-50 dark:bg-gray-950' },
  { regex: /(?<!dark:)bg-gray-100/g, replacement: 'bg-gray-100 dark:bg-gray-800' },
  { regex: /(?<!dark:)text-gray-900/g, replacement: 'text-gray-900 dark:text-gray-100' },
  { regex: /(?<!dark:)text-gray-700/g, replacement: 'text-gray-700 dark:text-gray-300' },
  { regex: /(?<!dark:)text-gray-600/g, replacement: 'text-gray-600 dark:text-gray-400' },
  { regex: /(?<!dark:)text-gray-500/g, replacement: 'text-gray-500 dark:text-gray-400' },
  { regex: /(?<!dark:)border-gray-200/g, replacement: 'border-gray-200 dark:border-gray-800' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') && !fullPath.includes('layout.tsx') && !fullPath.includes('ThemeToggle.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Prevent double replacements by replacing dark: classes with placeholders first?
      // Our regex uses negative lookbehind (?<!dark:) so it won't replace already added dark classes.
      
      let modified = content;
      for (const { regex, replacement } of replacements) {
        modified = modified.replace(regex, replacement);
      }
      
      if (modified !== content) {
        fs.writeFileSync(fullPath, modified);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, '../src/app/admin'));
console.log('Done adding dark classes!');
