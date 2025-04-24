import * as fs from 'fs';
import * as path from 'path';

interface DeploymentConfig {
    [protocol: string]: {
        schema: string;
        base: string;
        protocol: string;
        project: string;
        deployments: {
            [key: string]: any;
        };
    };
}

function getSubgraphFolders(): string[] {
    const subgraphsPath = path.join(process.cwd(), 'subgraphs');
    return fs.readdirSync(subgraphsPath)
        .filter(item => fs.statSync(path.join(subgraphsPath, item)).isDirectory());
}

function getDeploymentProtocols(): string[] {
    const deploymentPath = path.join(process.cwd(), 'deployment', 'deployment.json');
    const deploymentContent = fs.readFileSync(deploymentPath, 'utf-8');
    const deploymentConfig: DeploymentConfig = JSON.parse(deploymentContent);
    return Object.keys(deploymentConfig);
}

function findMissingProtocols(): void {
    const subgraphFolders = getSubgraphFolders();
    const deploymentProtocols = getDeploymentProtocols();

    const missingInSubgraphs = deploymentProtocols.filter(
        protocol => !subgraphFolders.includes(protocol)
    );

    const missingInDeployment = subgraphFolders.filter(
        folder => !deploymentProtocols.includes(folder)
    );

    console.log('\nValidation Results:');
    console.log('------------------');
    
    if (missingInSubgraphs.length > 0) {
        console.log('\nProtocols in deployment.json but missing in subgraphs folder:');
        missingInSubgraphs.forEach(protocol => console.log(`- ${protocol}`));
    }

    if (missingInDeployment.length > 0) {
        console.log('\nFolders in subgraphs but missing in deployment.json:');
        missingInDeployment.forEach(folder => console.log(`- ${folder}`));
    }

    if (missingInSubgraphs.length === 0 && missingInDeployment.length === 0) {
        console.log('\nAll protocols are properly synchronized between deployment.json and subgraphs folder!');
    }
}

// Run the validation
findMissingProtocols(); 