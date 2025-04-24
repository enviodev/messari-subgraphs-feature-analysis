# Subgraphs Feature Analysis

This repository contains the code analysed, the data used and information generated, and the scripts to analyse messari subgraphs and their features used. 

## Protocol Validation Script

The repository includes a TypeScript script (`scripts/validate-protocols.ts`) that performs validation between the `deployment.json` configuration and the actual subgraph implementations. This script helps maintain consistency between the protocol configurations and their implementations.

### Purpose
- Ensures that all protocols listed in `deployment.json` have corresponding subgraph implementations
- Identifies any subgraph folders that might be missing from the deployment configuration
- Helps maintain data integrity and completeness in the subgraph ecosystem

### Usage
```bash
# Build the TypeScript files
npm run build

# Run the validation script
npm run validate-protocols > data/validate-protocols.out
```

### Findings
The script will output:
- Protocols in `deployment.json` that are missing from the `subgraphs` folder
- Folders in `subgraphs` that are missing from `deployment.json`
- A success message if everything is properly synchronized

It seems there is a large amount of inconsistencies, and so the deployments.json file will largely be ignored and data analysis will be done on the code within `subgraphs` directly. 

## Contract Calls Analysis Script

The repository includes a TypeScript script (`scripts/find-contract-calls.ts`) that analyzes all subgraphs to identify where contract calls are being made using the `.bind()` method.

### Purpose
- Identifies all subgraphs that make direct contract calls
- Locates specific files and line numbers where contract calls occur
- Provides a comprehensive view of contract interaction patterns across subgraphs

### Usage
```bash
# Run the contract calls analysis
npm run find-contract-calls > data/contract-calls.csv
```

### Output Format
The script outputs a CSV file with the following columns:
- `project`: Name of the subgraph project
- `file`: Relative path to the file containing the contract call
- `lineNumber`: Line number where the contract call was found
- `line`: The actual line of code containing the contract call

The script also provides a summary of:
- Total number of contract calls found
- Number of unique projects using contract calls

## No Contract Calls Analysis Script

The repository includes a TypeScript script (`scripts/find-no-contract-calls.ts`) that identifies subgraphs that don't use any contract calls (`.bind()` method).

### Purpose
- Identifies subgraphs that rely solely on event-based indexing
- Helps understand which subgraphs don't need direct contract interactions
- Provides insights into subgraph implementation patterns

### Usage
```bash
# Run the no contract calls analysis
npm run find-no-contract-calls > data/no-contract-calls.csv
```

### Output Format
The script outputs:
1. A CSV file with the following columns:
   - `subgraph`: Name of the subgraph
   - `uses_contract_calls`: Boolean indicating if the subgraph uses contract calls

2. A summary showing:
   - Total number of subgraphs
   - Number and percentage of subgraphs without contract calls
   - Number and percentage of subgraphs with contract calls

3. A sorted list of all subgraphs that don't use contract calls