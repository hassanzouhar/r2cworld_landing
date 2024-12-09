const fs = require('fs');
const path = require('path');

// Directories to process
const directories = ['pages', 'blog'];

// Function to get all `.md` files in a directory
function getMarkdownFiles(dirPath) {
    try {
        return fs
            .readdirSync(dirPath)
            .filter((file) => file.endsWith('.md')); // Only include Markdown files
    } catch (error) {
        console.error(`Error reading directory: ${dirPath}`, error);
        return [];
    }
}

// Function to write `file-list.json` for each directory
function buildFileList(dirPath) {
    const files = getMarkdownFiles(dirPath);
    const outputFilePath = path.join(dirPath, 'file-list.json');

    try {
        fs.writeFileSync(outputFilePath, JSON.stringify(files, null, 2));
        console.log(`Generated file list: ${outputFilePath}`);
    } catch (error) {
        console.error(`Error writing file list for: ${dirPath}`, error);
    }
}

// Main build process
function main() {
    directories.forEach((dir) => {
        const dirPath = path.resolve(__dirname, dir);
        if (!fs.existsSync(dirPath)) {
            console.warn(`Directory not found: ${dirPath}`);
            return;
        }
        buildFileList(dirPath);
    });
}

main();