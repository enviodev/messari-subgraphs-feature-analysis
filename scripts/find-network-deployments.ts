import fs from 'fs';
import path from 'path';

interface NetworkDeployment {
  project: string;
  network: string;
  deploymentPath: string;
}

function findNetworkDeployments(): NetworkDeployment[] {
  const subgraphsDir = path.join(process.cwd(), 'subgraphs');
  const networkDeployments: NetworkDeployment[] = [];

  // Get all subgraph directories
  const subgraphDirs = fs.readdirSync(subgraphsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // Process each subgraph directory
  for (const project of subgraphDirs) {
    const projectDir = path.join(subgraphsDir, project);
    
    // Find all deployment directories
    const findDeploymentDirs = (dir: string): string[] => {
      const deploymentDirs: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name === 'deployments') {
            deploymentDirs.push(fullPath);
          } else {
            deploymentDirs.push(...findDeploymentDirs(fullPath));
          }
        }
      }
      
      return deploymentDirs;
    };

    const deploymentDirs = findDeploymentDirs(projectDir);

    // Process each deployment directory
    for (const deploymentDir of deploymentDirs) {
      const networkDirs = fs.readdirSync(deploymentDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      // Add each network to the results
      for (const network of networkDirs) {
        networkDeployments.push({
          project,
          network,
          deploymentPath: path.relative(subgraphsDir, path.join(deploymentDir, network))
        });
      }
    }
  }

  return networkDeployments;
}

function main() {
  try {
    const networkDeployments = findNetworkDeployments();
    
    // Sort by project name and then network name
    networkDeployments.sort((a, b) => {
      if (a.project !== b.project) {
        return a.project.localeCompare(b.project);
      }
      return a.network.localeCompare(b.network);
    });

    // Write to CSV
    const csvContent = [
      'project,network,deploymentPath',
      ...networkDeployments.map(deployment => 
        `"${deployment.project}","${deployment.network}","${deployment.deploymentPath.replace(/"/g, '""')}"`
      )
    ].join('\n');

    fs.writeFileSync('data/network-deployments.csv', csvContent);

    // Group deployments by project
    const projectDeployments = new Map<string, string[]>();
    for (const deployment of networkDeployments) {
      if (!projectDeployments.has(deployment.project)) {
        projectDeployments.set(deployment.project, []);
      }
      projectDeployments.get(deployment.project)?.push(deployment.network);
    }

    // Print summary
    console.log('\nSummary:');
    console.log(`Total network deployments found: ${networkDeployments.length}`);
    console.log(`Projects with network deployments: ${projectDeployments.size}`);
    
    // Print detailed information for each project
    console.log('\nNetwork deployments by project:');
    for (const [project, networks] of projectDeployments.entries()) {
      console.log(`\n${project} (${networks.length} networks):`);
      networks.sort().forEach(network => {
        console.log(`  - ${network}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 