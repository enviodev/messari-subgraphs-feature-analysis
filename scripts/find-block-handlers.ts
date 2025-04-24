import * as fs from 'fs';
import * as path from 'path';

interface BlockHandlerInfo {
    project: string;
    file: string;
    lineNumber: number;
    line: string;
}

function findBlockHandlers(): BlockHandlerInfo[] {
    const subgraphsPath = path.join(process.cwd(), 'subgraphs');
    const results: BlockHandlerInfo[] = [];

    // Get all subgraph folders
    const subgraphFolders = fs.readdirSync(subgraphsPath)
        .filter(item => fs.statSync(path.join(subgraphsPath, item)).isDirectory());

    for (const folder of subgraphFolders) {
        const folderPath = path.join(subgraphsPath, folder);
        const blockHandlers = searchFolderForBlockHandlers(folderPath, folder);
        results.push(...blockHandlers);
    }

    return results;
}

function searchFolderForBlockHandlers(folderPath: string, projectName: string): BlockHandlerInfo[] {
    const results: BlockHandlerInfo[] = [];

    function searchDirectory(dirPath: string) {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                searchDirectory(fullPath);
            } else if (file.endsWith('.yaml')) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    if (line.includes('blockHandlers')) {
                        results.push({
                            project: projectName,
                            file: path.relative(process.cwd(), fullPath),
                            lineNumber: index + 1,
                            line: line.trim()
                        });
                    }
                });
            }
        }
    }

    searchDirectory(folderPath);
    return results;
}

function outputResults(results: BlockHandlerInfo[]): void {
    // Output CSV header
    console.log('project,file,lineNumber,line');

    // Output each result as CSV
    results.forEach(result => {
        // Escape any commas in the line content and wrap in quotes
        const escapedLine = `"${result.line.replace(/"/g, '""')}"`;
        console.log(`${result.project},${result.file},${result.lineNumber},${escapedLine}`);
    });

    // Calculate statistics
    const uniqueProjects = new Set(results.map(r => r.project));
    
    // Get total number of projects
    const subgraphsPath = path.join(process.cwd(), 'subgraphs');
    const totalProjects = fs.readdirSync(subgraphsPath)
        .filter(item => fs.statSync(path.join(subgraphsPath, item)).isDirectory())
        .length;

    // Output summary
    console.log('\nSummary:');
    console.log(`Total blockHandlers found: ${results.length}`);
    console.log(`Projects with blockHandlers: ${uniqueProjects.size} / ${totalProjects}`);
    
    // Output list of projects with blockHandlers
    console.log('\nProjects with blockHandlers:');
    Array.from(uniqueProjects)
        .sort()
        .forEach(project => console.log(`- ${project}`));
}

// Run the search
const results = findBlockHandlers();
outputResults(results); 