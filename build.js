/* 
This script attempts to build the HTML files necessary for the webpage pawskeparty.com
The following pseudocode shows what it's supposed to do:

find base.html;
find all partial-.html files and the page connected to handlebars;
foreach html file in "pages" {
    identify all handlebar tags
    assemble html file (slot partials in)
    move to "/public/"
    copy over css and pictures too
} 

*/

const path = require('path');
const fs = require('fs');

const readHTMLFilesInSubdirectory = (subdirectory) => {
    const htmlFilesContent = {};
    const directoryPath = path.join(__dirname, subdirectory);

    const files = fs.readdirSync(directoryPath);
    const htmlFilesNames = files.filter(file => path.extname(file) === '.html');

    htmlFilesNames.forEach(fileName => {
        const filePath = path.join(directoryPath, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        htmlFilesContent[fileName] = fileContent;
    });

    return htmlFilesContent;
}

createOuputDirectory = () => {
    if (!fs.existsSync("output")) {
        fs.mkdirSync("output");
        console.log("done");
    }
}

const tagToFileName = (tag) => {
    const startIndex = tag.indexOf('"') + 1; // Find the index of the first quote
    const endIndex = tag.lastIndexOf('"'); // Find the index of the last quote
    return tag.substring(startIndex, endIndex); // Extract the file name between the quotes
}

const buildTransformedPages = (pages, partials) => {
    var transformedPages = {};

    var pageFileNames = Object.keys(pages);

    for (let i = 0; i < pageFileNames.length; i++) {
        const pageFileName = pageFileNames[i];
        console.log("Currently assembling page: ", pageFileName);

        var inputPage = pages[pageFileName];

        const regex = /\{\{-partial "(.*?)"-\}\}/g;
        const allTagOccurences = inputPage.match(regex);

        if (allTagOccurences == null) return transformedPages[pageFileName] = inputPage;

        var outputPage = inputPage;

        allTagOccurences.forEach(tag => {
            var fileName = tagToFileName(tag);

            var partial = partials[fileName];
            outputPage = outputPage.replace(tag, partial, (error) => { console.log("writing failed, error:", error) });
        });


        // fs.writeFile("/output/"+pageFileName,outputPage);
        fs.writeFileSync("output/" + pageFileName, outputPage);

        // transformedPages[pageKey] = outputPage;
        // console.log(outputPage);
    }

    // return transformedPages;
}

const CopyFolderToOutput = (inputPath,OutputPath) => {
    fs.cpSync(inputPath, OutputPath, {recursive: true});
}


const partials = readHTMLFilesInSubdirectory("./src/partials", ".html");
const pages = readHTMLFilesInSubdirectory("./src/pages", ".html");
createOuputDirectory();
buildTransformedPages(pages, partials);
CopyFolderToOutput("src/images", "output/images");
CopyFolderToOutput("src/css", "output/css");
CopyFolderToOutput("src/font", "output/font");
// CopyFolderToOutput("src/landingPages", "output/landingPages");
fs.copyFileSync("src/.htaccess","output/.htacess");