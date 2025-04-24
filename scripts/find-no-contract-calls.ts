import * as fs from 'fs';
import * as path from 'path';

interface SubgraphInfo {
    name: string;
    hasContractCalls: boolean;
}

function findSubgraphsWithoutContractCalls(): SubgraphInfo[] {
    const subgraphsPath = path.join(process.cwd(), 'subgraphs');
    const results: SubgraphInfo[] = [];

    // Get all subgraph folders
    const subgraphFolders = fs.readdirSync(subgraphsPath)
        .filter(item => fs.statSync(path.join(subgraphsPath, item)).isDirectory());

    for (const folder of subgraphFolders) {
        const folderPath = path.join(subgraphsPath, folder);
        const hasContractCalls = checkForContractCalls(folderPath);
        
        results.push({
            name: folder,
            hasContractCalls
        });
    }

    return results;
}

function checkForContractCalls(folderPath: string): boolean {
    let foundContractCall = false;

    function searchDirectory(dirPath: string) {
        if (foundContractCall) return; // Early exit if we found a contract call

        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            if (foundContractCall) return; // Early exit if we found a contract call

            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                searchDirectory(fullPath);
            } else if (file.endsWith('.ts')) {
                const content = fs.readFileSync(fullPath, 'utf-8');
                if (content.includes('.bind(')) {
                    foundContractCall = true;
                    return;
                }
            }
        }
    }

    searchDirectory(folderPath);
    return foundContractCall;
}

function outputResults(results: SubgraphInfo[]): void {
    // Output CSV header
    console.log('subgraph,uses_contract_calls');

    // Output each result as CSV
    results.forEach(result => {
        console.log(`${result.name},${result.hasContractCalls}`);
    });

    // Calculate statistics
    const totalSubgraphs = results.length;
    const subgraphsWithoutCalls = results.filter(r => !r.hasContractCalls).length;
    const subgraphsWithCalls = results.filter(r => r.hasContractCalls).length;

    // Output summary
    console.log('\nSummary:');
    console.log(`Total subgraphs: ${totalSubgraphs}`);
    console.log(`Subgraphs without contract calls: ${subgraphsWithoutCalls} (${Math.round(subgraphsWithoutCalls/totalSubgraphs*100)}%)`);
    console.log(`Subgraphs with contract calls: ${subgraphsWithCalls} (${Math.round(subgraphsWithCalls/totalSubgraphs*100)}%)`);

    // Output list of subgraphs without contract calls
    console.log('\nSubgraphs without contract calls:');
    results
        .filter(r => !r.hasContractCalls)
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(r => console.log(`- ${r.name}`));
}

// Run the search
const results = findSubgraphsWithoutContractCalls();
outputResults(results); 