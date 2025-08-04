import { generateDockerCompose } from '@/lib/dockerCompose';

// Test the docker-compose module separately
try {
  console.log('Available exports:', Object.keys({ generateDockerCompose }));
} catch (error) {
  console.log('Error importing module:', error);
}
