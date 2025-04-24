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