import * as fs from 'fs';
import * as path from 'path';

interface TokenCall {
    project: string;
    file: string;
    lineNumber: number;
    line: string;
}

function analyzeTokenCalls(): TokenCall[] {
    const csvPath = path.join(process.cwd(), 'data', 'contract-calls.out');
    
    // Check if file exists
    if (!fs.existsSync(csvPath)) {
        console.error(`Error: File not found at ${csvPath}`);
        console.error('Please run the find-contract-calls script first to generate the CSV file.');
        process.exit(1);
    }

    const results: TokenCall[] = [];
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n');

    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Parse CSV line (handling quoted values)
        const parts = parseCSVLine(line);
        if (parts.length < 4) continue;

        const [project, file, lineNumber, codeLine] = parts;
        
        // Check if the line contains token-related keywords (case-insensitive)
        const lowerLine = codeLine.toLowerCase();
        if (lowerLine.includes('erc20') || 
            lowerLine.includes('token') || 
            lowerLine.includes('coin')) {
            
            results.push({
                project,
                file,
                lineNumber: parseInt(lineNumber, 10),
                line: codeLine
            });
        }
    }

    return results;
}

// Helper function to parse CSV lines with quoted values
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
                // Handle escaped quotes (double quotes)
                current += '"';
                i++;
            } else {
                // Toggle quote state
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            // End of field
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    // Add the last field
    result.push(current);
    
    return result;
}

function outputResults(results: TokenCall[]): void {
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
    
    // Get total number of projects from the original CSV
    const csvPath = path.join(process.cwd(), 'data', 'contract-calls.out');
    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n');
    const allProjects = new Set<string>();
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parts = parseCSVLine(line);
        if (parts.length > 0) {
            allProjects.add(parts[0]);
        }
    }

    // Output summary
    console.log('\nSummary:');
    console.log(`Total token-related contract calls found: ${results.length}`);
    console.log(`Projects with token-related contract calls: ${uniqueProjects.size} / ${allProjects.size}`);
    
    // Output list of projects with token calls
    console.log('\nProjects with token-related contract calls:');
    Array.from(uniqueProjects)
        .sort()
        .forEach(project => console.log(`- ${project}`));
}

// Run the analysis
const results = analyzeTokenCalls();
outputResults(results); 