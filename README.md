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

## Token Calls Analysis Script

The repository includes a TypeScript script (`scripts/analyze-token-calls.ts`) that analyzes the contract calls CSV file to identify token-related contract interactions.

### Purpose
- Identifies contract calls related to tokens (ERC20, tokens, coins)
- Provides insights into how subgraphs interact with token contracts
- Helps understand token usage patterns across the subgraph ecosystem

### Usage
```bash
# First, generate the contract calls CSV
npm run find-contract-calls > data/contract-calls.csv

# Then analyze token-related calls
npm run analyze-token-calls > data/token-calls.csv
```

### Output Format
The script outputs:
1. A CSV file with the following columns:
   - `project`: Name of the subgraph project
   - `file`: Relative path to the file containing the token-related call
   - `lineNumber`: Line number where the call was found
   - `line`: The actual line of code containing the token-related call

2. A summary showing:
   - Total number of token-related contract calls found
   - Number of projects with token-related contract calls

3. A sorted list of all projects that interact with token contracts

## Block Handlers Analysis Script

The repository includes a TypeScript script (`scripts/find-block-handlers.ts`) that identifies subgraphs that use block handlers in their YAML configuration files.

### Purpose
- Identifies subgraphs that use block-based indexing (rather than event-based)
- Helps understand which subgraphs index every block vs. specific events
- Provides insights into indexing patterns across the subgraph ecosystem

### Usage
```bash
# Run the block handlers analysis
npm run find-block-handlers > data/block-handlers.csv
```

### Findings

Summary:
Total blockHandlers found: 6
Projects with blockHandlers: 2 / 171

It seems only network indexers that simply index each block are here, this aligns with our thesis that there is never a good case to use blockhandlers in indexers due to it's considerable performance bottleneck

## Call Handlers Analysis Script

The repository includes a TypeScript script (`scripts/find-call-handlers.ts`) that identifies subgraphs that use call handlers in their YAML configuration files.

### Purpose
- Identifies subgraphs that use call-based indexing (indexing specific function calls)
- Helps understand which subgraphs track specific contract function calls
- Provides insights into indexing patterns across the subgraph ecosystem

### Usage
```bash
# Run the call handlers analysis
npm run find-call-handlers > data/call-handlers.csv
```

### Output Format
The script outputs:
1. A CSV file with the following columns:
   - `project`: Name of the subgraph project
   - `file`: Relative path to the YAML file containing the call handler
   - `lineNumber`: Line number where the call handler was found
   - `line`: The actual line of code containing the call handler definition

2. A summary showing:
   - Total number of call handlers found
   - Number of projects using call handlers

3. A sorted list of all projects that use call handlers

## Dynamic Contracts Analysis Script

The repository includes a TypeScript script (`scripts/find-dynamic-contracts.ts`) that identifies subgraphs that use dynamic contracts (Templates) in their YAML configuration files.

### Purpose
- Identifies subgraphs that use dynamic contract templates
- Helps understand which subgraphs can handle dynamically deployed contracts
- Provides insights into subgraph flexibility and adaptability

### Usage
```bash
# Run the dynamic contracts analysis
npm run find-dynamic-contracts > data/dynamic-contracts.csv
```

### Output Format
The script outputs:
1. A CSV file with the following columns:
   - `project`: Name of the subgraph project
   - `file`: Relative path to the YAML file containing the Templates section
   - `lineNumber`: Line number where the Templates section was found
   - `line`: The actual line of code containing the Templates definition

2. A summary showing:
   - Total number of dynamic contract definitions found
   - Number of projects using dynamic contracts

3. A sorted list of all projects that use dynamic contracts