# Messari Subgraphs Feature Analysis Report

## 1. Executive Summary

This report analyzes 159 subgraphs from Messari’s open-source repository to identify patterns in feature usage. The goal is to inform the HyperIndex feature roadmap by highlighting commonly used subgraph features and identifying ideal integration opportunities. Key findings show that contract calls are used in 97% of subgraphs, while dynamic contracts appear in roughly one-third. Less common features include call handlers (12%), IPFS (2%), and block handlers (1%). These insights guide which capabilities HyperIndex should prioritize and which protocols are best suited for migration.

## 2. Background & Motivation

Messari maintains a large repository of open-source subgraphs across multiple blockchain protocols. These subgraphs power analytics, dashboards, and DeFi data infrastructure. Envio’s HyperIndex is a high-performance, multichain indexer designed to simplify and accelerate subgraph-like workloads. This report aims to identify the most common subgraph features and ideal candidates for migration to HyperIndex—focusing on protocols that are multichain, straightforward, and aligned with HyperIndex’s current capabilities.

## 3. Data Sources

- **Subgraph Codebase**  
  https://github.com/messari/subgraphs  
  Source of all protocol subgraphs analyzed.

- **Subgraph Metadata**  
  https://subgraphs.messari.io/  
  Provides deployment and categorization details for each protocol.

- **Feature Analysis Scripts**  
  https://github.com/enviodev/messari-subgraphs-feature-analysis  
  Custom TypeScript scripts developed to parse, analyze, and classify subgraph features.

## 4. Methodology

- All analysis was performed on the open-source Messari subgraphs repo.
- The `deployment.json` file was ignored due to inconsistencies; only the actual code under `/subgraphs` was analyzed.
- Scripts were written in TypeScript and are available at:  
  https://github.com/enviodev/messari-subgraphs-feature-analysis
- Each script performs basic text and pattern matching to detect usage of:
  - Contract calls via `.bind()` methods in TS files
  - Call handlers and block handlers in YAML files
  - Dynamic contracts via template usage in YAML files
  - IPFS integration in YAML files
- A final aggregation script generates a unified feature matrix from all outputs.

## 5. Feature Matrix

View the matrix:  
[Feature Matrix Spreadsheet](https://docs.google.com/spreadsheets/d/1PFko5Jnk32a0X2DN7U07FHJX_l58Lv7jmAz5nsg1SK8/edit?usp=sharing)

## 6. Analysis & Insights

- **97%** use contract calls.
  - Indicates potential performance bottlenecks, as direct contract reads are slower than event-based indexing.
  - However, many of these calls are **infrequent lookups** (e.g. token name, symbol, decimals) with minimal performance impact.
  - Further profiling is needed to distinguish high-frequency contract call usage from infrequent metadata reads.

- **34%** use dynamic contracts (templates).
  - A strong signal of compatibility with HyperIndex, which supports high-scale dynamic contract indexing (e.g. 150k+ templates in production).

- **12%** use call handlers — a feature not currently supported in HyperIndex.
  - While used by a minority, it presents a potential roadmap consideration.

- **1%** use block handlers — typically in network-level block indexers (e.g. bridges).
  - This is largely redundant in HyperIndex due to built-in block data via HyperSync.

- **47 protocols** were identified as well-aligned with HyperIndex:
  - Multichain
  - No use of block or call handlers
  - Simple architecture

- **Top 21 Migration Candidates**  
  Protocols deployed across **5+ networks** — signaling pain from scale and complexity:

aave-forks
abracadabra
across-v2
balancer-forks
beefy-finance
compound-forks
curve-finance
erc20
frax-ether-staking
gmx-forks
governor-alpha-bravo
hop-protocol
mountain-protocol
multichain
mux-protocol
openzeppelin-governor
orbit
qidao
renzo
stargate
uniswap-v3-forks
uniswap-v3-forks-swap
uniswap-forks-swap

  > These protocols are highly likely to benefit from both performance and simplicity improvements offered by HyperIndex.

## 7. Recommendations

- **Expand protocol templates**  
  Prioritize building reusable templates for common frameworks such as **Compound** and **Compound Governance**.

- **Improve migration tooling**  
  Invest in tooling to ease the migration of existing subgraphs to HyperIndex (e.g. YAML translators, schema converters, CLI tools).

- **Conduct deeper production analysis**  
  Further study is needed on live indexers to measure:
  - Sync speed across chains
  - Frequency and volume of contract calls
  - Event load vs. sync performance  
  This will better highlight HyperIndex’s historical sync advantages.

## 8. Data Disclaimer

The scripts used to parse and analyze subgraph data have been “vibe coded” — relying on heuristic text pattern matching and basic structure analysis.  
As such, **data may contain inaccuracies**, false positives, or omissions, especially in complex or non-standard subgraphs.  
This report is meant to provide directional insight rather than exact technical precision.

## 9. Further Work

- Analyze subgraphs beyond Messari, including:
  - Popular subgraphs on The Graph Explorer
  - Protocols like Aave, Synthetix, and Uniswap
  - GitHub topic search: [`topic:subgraph`](https://github.com/topics/subgraph)

- Compare feature usage trends across different teams and verticals.

- Investigate unique opportunities for HyperIndex's capabilities (e.g. wildcard indexing, schema merging).

- Consider benchmarking runtime performance (HyperIndex vs. graph-node vs. hosted service).