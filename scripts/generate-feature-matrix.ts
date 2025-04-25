import fs from 'fs';
import path from 'path';

interface ProtocolFeatures {
  protocol: string;
  networks: number;
  callHandlers: boolean;
  ipfs: boolean;
  blockHandlers: boolean;
  dynamicContracts: boolean;
  contractCalls: boolean;
}

function readCsvFile(filePath: string): Map<string, boolean> {
  const protocols = new Map<string, boolean>();
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').slice(1); // Skip header
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const [protocol] = line.split(',');
      if (protocol) {
        protocols.set(protocol.replace(/^"/, '').replace(/"$/, ''), true);
      }
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }
  
  return protocols;
}

function readNetworkDeployments(filePath: string): Map<string, number> {
  const protocolNetworks = new Map<string, number>();
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').slice(1); // Skip header
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      const [protocol] = line.split(',');
      if (protocol) {
        const cleanProtocol = protocol.replace(/^"/, '').replace(/"$/, '');
        protocolNetworks.set(
          cleanProtocol, 
          (protocolNetworks.get(cleanProtocol) || 0) + 1
        );
      }
    }
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
  }
  
  return protocolNetworks;
}

function generateFeatureMatrix(): ProtocolFeatures[] {
  const dataDir = path.join(process.cwd(), 'data');
  
  // Read data from CSV files
  const callHandlersProtocols = readCsvFile(path.join(dataDir, 'call-handlers.csv'));
  const ipfsProtocols = readCsvFile(path.join(dataDir, 'ipfs-integrations.csv'));
  const blockHandlersProtocols = readCsvFile(path.join(dataDir, 'find-block-handlers.out'));
  const dynamicContractsProtocols = readCsvFile(path.join(dataDir, 'dynamic-contracts.csv'));
  const contractCallsProtocols = readCsvFile(path.join(dataDir, 'contract-calls.out'));
  const protocolNetworks = readNetworkDeployments(path.join(dataDir, 'network-deployments.csv'));
  
  // Get all unique protocols
  const allProtocols = new Set<string>();
  
  [
    callHandlersProtocols,
    ipfsProtocols,
    blockHandlersProtocols,
    dynamicContractsProtocols,
    contractCallsProtocols,
    protocolNetworks
  ].forEach(map => {
    map.forEach((_, protocol) => allProtocols.add(protocol));
  });
  
  // Generate feature matrix
  const featureMatrix: ProtocolFeatures[] = [];
  
  for (const protocol of allProtocols) {
    featureMatrix.push({
      protocol,
      networks: protocolNetworks.get(protocol) || 0,
      callHandlers: callHandlersProtocols.has(protocol),
      ipfs: ipfsProtocols.has(protocol),
      blockHandlers: blockHandlersProtocols.has(protocol),
      dynamicContracts: dynamicContractsProtocols.has(protocol),
      contractCalls: contractCallsProtocols.has(protocol)
    });
  }
  
  // Sort by protocol name
  featureMatrix.sort((a, b) => a.protocol.localeCompare(b.protocol));
  
  return featureMatrix;
}

function main() {
  try {
    const featureMatrix = generateFeatureMatrix();
    
    // Write to CSV
    const csvContent = [
      'protocol,networks,callHandlers,ipfs,blockHandlers,dynamicContracts,contractCalls',
      ...featureMatrix.map(features => 
        `"${features.protocol}",${features.networks},${features.callHandlers},${features.ipfs},${features.blockHandlers},${features.dynamicContracts},${features.contractCalls}`
      )
    ].join('\n');

    fs.writeFileSync('data/feature-matrix.csv', csvContent);

    // Print summary
    console.log('\nFeature Matrix Summary:');
    console.log(`Total protocols analyzed: ${featureMatrix.length}`);
    
    // Count protocols with each feature
    const withCallHandlers = featureMatrix.filter(f => f.callHandlers).length;
    const withIpfs = featureMatrix.filter(f => f.ipfs).length;
    const withBlockHandlers = featureMatrix.filter(f => f.blockHandlers).length;
    const withDynamicContracts = featureMatrix.filter(f => f.dynamicContracts).length;
    const withContractCalls = featureMatrix.filter(f => f.contractCalls).length;
    
    console.log(`Protocols with call handlers: ${withCallHandlers} (${Math.round(withCallHandlers / featureMatrix.length * 100)}%)`);
    console.log(`Protocols with IPFS: ${withIpfs} (${Math.round(withIpfs / featureMatrix.length * 100)}%)`);
    console.log(`Protocols with block handlers: ${withBlockHandlers} (${Math.round(withBlockHandlers / featureMatrix.length * 100)}%)`);
    console.log(`Protocols with dynamic contracts: ${withDynamicContracts} (${Math.round(withDynamicContracts / featureMatrix.length * 100)}%)`);
    console.log(`Protocols with contract calls: ${withContractCalls} (${Math.round(withContractCalls / featureMatrix.length * 100)}%)`);
    
    // Network distribution
    const networkCounts = new Map<number, number>();
    featureMatrix.forEach(f => {
      const count = networkCounts.get(f.networks) || 0;
      networkCounts.set(f.networks, count + 1);
    });
    
    console.log('\nNetwork distribution:');
    Array.from(networkCounts.entries())
      .sort((a, b) => a[0] - b[0])
      .forEach(([networks, count]) => {
        console.log(`Protocols with ${networks} network(s): ${count} (${Math.round(count / featureMatrix.length * 100)}%)`);
      });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 