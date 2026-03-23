import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.astro')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    // VERY simple regex to add loading="lazy" to <img> tags without it
    content = content.replace(/<img([^>]*)>/gi, (match, attrs) => {
      if (attrs.includes('loading=')) return match;
      return `<img loading="lazy" ${attrs}>`;
    });
    if (original !== content) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
console.log("Lazy loading applied.");
