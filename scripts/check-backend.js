#!/usr/bin/env node

const http = require('http');
const https = require('https');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

function checkBackend() {
  const url = new URL(API_URL);
  const client = url.protocol === 'https:' ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: '/health',
    method: 'GET',
    timeout: 5000,
  };

  const req = client.request(options, (res) => {
    console.log(`✅ Backend is running at ${API_URL}`);
    console.log(`   Status: ${res.statusCode}`);
    console.log(`   Health endpoint: ${API_URL}/health`);
    console.log(`   Frontend should be running on: http://localhost:3002`);
    process.exit(0);
  });

  req.on('error', (error) => {
    console.error(`❌ Backend is not accessible at ${API_URL}`);
    console.error(`   Error: ${error.message}`);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the backend server is running on port 3000');
    console.log('   2. Check if the port is correct');
    console.log('   3. Verify firewall settings');
    console.log('   4. Try running: cd ../backend && npm run start:dev');
    console.log('   5. Frontend is now running on port 3002');
    process.exit(1);
  });

  req.on('timeout', () => {
    console.error(`⏰ Backend connection timeout at ${API_URL}`);
    req.destroy();
    process.exit(1);
  });

  req.end();
}

console.log('🔍 Checking backend connectivity...');
console.log(`   Expected backend URL: ${API_URL}`);
console.log(`   Frontend will run on: http://localhost:3002`);
checkBackend(); 