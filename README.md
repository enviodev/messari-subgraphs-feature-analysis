# Messari Subgraphs Feature Analysis

This repository contains scripts for analyzing various features and patterns in Messari subgraphs.

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

### Output Format
The script outputs:
1. A CSV file with the following columns:
   - `project`: Name of the subgraph project
   - `file`: Relative path to the YAML file containing the block handler
   - `lineNumber`: Line number where the block handler was found
   - `line`: The actual line of code containing the block handler definition

2. A summary showing:
   - Total number of block handlers found
   - Number of projects using block handlers

3. A sorted list of all projects that use block handlers

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

## IPFS Integrations Analysis Script

The repository includes a TypeScript script (`scripts/find-ipfs-integrations.ts`) that identifies subgraphs that use IPFS integrations, specifically looking for "ipfsOnEthereumContracts" in YAML configuration files.

### Purpose
- Identifies subgraphs that integrate with IPFS
- Helps understand which subgraphs store data on IPFS
- Provides insights into decentralized storage usage across the subgraph ecosystem

### Usage
```bash
# Run the IPFS integrations analysis
npm run find-ipfs-integrations > data/ipfs-integrations.csv
```

### Output Format
The script outputs:
1. A CSV file with the following columns:
   - `project`: Name of the subgraph project
   - `file`: Relative path to the YAML file containing the IPFS integration
   - `lineNumber`: Line number where the IPFS integration was found
   - `line`: The actual line of code containing the IPFS integration definition

2. A summary showing:
   - Total number of IPFS integrations found
   - Number of projects using IPFS integrations

3. A sorted list of all projects that use IPFS integrations

## Arweave Integrations Analysis Script

The repository includes a TypeScript script (`scripts/find-arweave-integrations.ts`) that identifies subgraphs that use Arweave integrations, specifically looking for "ArweaveContent" in YAML configuration files.

### Purpose
- Identifies subgraphs that integrate with Arweave
- Helps understand which subgraphs store data on Arweave
- Provides insights into decentralized storage usage across the subgraph ecosystem

### Usage
```bash
# Run the Arweave integrations analysis
npm run find-arweave-integrations > data/arweave-integrations.csv
```

### Output Format
The script outputs:
1. A CSV file with the following columns:
   - `project`: Name of the subgraph project
   - `file`: Relative path to the YAML file containing the Arweave integration
   - `lineNumber`: Line number where the Arweave integration was found
   - `line`: The actual line of code containing the Arweave integration definition

2. A summary showing:
   - Total number of Arweave integrations found
   - Number of projects using Arweave integrations

3. A sorted list of all projects that use Arweave integrations

## Network Deployments Analysis Script

The repository includes a TypeScript script (`scripts/find-network-deployments.ts`) that identifies the networks each subgraph is deployed to by looking for deployment folders.

### Purpose
- Identifies all networks that each subgraph is deployed to
- Helps understand the multi-chain presence of each subgraph
- Provides insights into cross-chain deployment patterns

### Usage
```bash
# Run the network deployments analysis
npm run find-network-deployments > data/network-deployments.csv
```

### Output Format
The script outputs:
1. A CSV file with the following columns:
   - `project`: Name of the subgraph project
   - `network`: Name of the network (e.g., mainnet, polygon, etc.)
   - `deploymentPath`: Relative path to the deployment folder

2. A summary showing:
   - Total number of network deployments found
   - Number of projects with network deployments

3. A detailed breakdown of networks for each project

## Feature Matrix Generation Script

The repository includes a TypeScript script (`scripts/generate-feature-matrix.ts`) that combines data from all the analysis scripts to create a comprehensive feature matrix.

### Purpose
- Creates a unified view of all subgraph features
- Provides a single CSV file with all feature data for each protocol
- Enables easy comparison and analysis of feature usage across protocols

### Usage
```bash
# First, run all the individual analysis scripts
npm run find-contract-calls > data/contract-calls.out
npm run find-no-contract-calls > data/no-contract-calls.out
npm run find-block-handlers > data/find-block-handlers.out
npm run find-call-handlers > data/call-handlers.csv
npm run find-dynamic-contracts > data/dynamic-contracts.csv
npm run find-ipfs-integrations > data/ipfs-integrations.csv
npm run find-network-deployments > data/network-deployments.csv

# Then generate the feature matrix
npm run generate-feature-matrix > data/feature-matrix.out
```

### Output Format
The script outputs:
1. A CSV file with the following columns:
   - `protocol`: Name of the subgraph project
   - `networks`: Number of networks the subgraph is deployed to
   - `callHandlers`: Boolean indicating if the subgraph uses call handlers
   - `ipfs`: Boolean indicating if the subgraph uses IPFS
   - `blockHandlers`: Boolean indicating if the subgraph uses block handlers
   - `dynamicContracts`: Boolean indicating if the subgraph uses dynamic contracts
   - `contractCalls`: Boolean indicating if the subgraph uses contract calls

2. A summary showing:
   - Total number of protocols analyzed
   - Percentage of protocols with each feature
   - Distribution of protocols by number of networks

## Requirements

- Node.js
- TypeScript
- ts-node

## Installation

```bash
npm install
```

## Contributing

Feel free to contribute new analysis scripts or improve existing ones.

