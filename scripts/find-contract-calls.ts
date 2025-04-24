import * as fs from 'fs';
import * as path from 'path';

interface ContractCall {
    project: string;
    file: string;
    lineNumber: number;
    line: string;
}

function findContractCalls(): ContractCall[] {
    const subgraphsPath = path.join(process.cwd(), 'subgraphs');
    const results: ContractCall[] = [];

    // Get all subgraph folders
    const subgraphFolders = fs.readdirSync(subgraphsPath)
        .filter(item => fs.statSync(path.join(subgraphsPath, item)).isDirectory());

    for (const folder of subgraphFolders) {
        const folderPath = path.join(subgraphsPath, folder);
        const contractCalls = searchFolderForContractCalls(folderPath, folder);
        results.push(...contractCalls);
    }

    return results;
}

function searchFolderForContractCalls(folderPath: string, projectName: string): ContractCall[] {
    const results: ContractCall[] = [];

    function searchDirectory(dirPath: string) {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                searchDirectory(fullPath);
            } else if (file.endsWith('.ts')) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                const lines = content.split('\n');

                lines.forEach((line, index) => {
                    if (line.includes('.bind(')) {
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

function outputResults(results: ContractCall[]): void {
    // Output CSV header
    console.log('project,file,lineNumber,line');

    // Output each result as CSV
    results.forEach(result => {
        // Escape any commas in the line content and wrap in quotes
        const escapedLine = `"${result.line.replace(/"/g, '""')}"`;
        console.log(`${result.project},${result.file},${result.lineNumber},${escapedLine}`);
    });

    // Get total number of projects
    const subgraphsPath = path.join(process.cwd(), 'subgraphs');
    const totalProjects = fs.readdirSync(subgraphsPath)
        .filter(item => fs.statSync(path.join(subgraphsPath, item)).isDirectory())
        .length;

    // Output summary
    console.log(`\nTotal contract calls found: ${results.length}`);
    console.log(`Projects with contract calls: ${new Set(results.map(r => r.project)).size} / ${totalProjects}`);
}

// Run the search
const results = findContractCalls();
outputResults(results); 