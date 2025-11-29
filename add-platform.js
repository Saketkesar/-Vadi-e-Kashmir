// Script to add Vercel platform to Appwrite project
// Run with: node add-platform.js

const { Client, Projects } = require('node-appwrite');

const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68833c43001b6aa15f16')
    .setKey(process.env.APPWRITE_API_KEY); // Your API key from .env

const projects = new Projects(client);

async function addPlatform() {
    try {
        // Add Vercel production platform
        const vercelPlatform = await projects.createPlatform(
            '68833c43001b6aa15f16', // Project ID
            'web', // Platform type
            'Vadi-e-Kashmir Vercel', // Name
            '', // Key (empty for web)
            '', // Store (empty for web)
            'vadi-e-kashmir.vercel.app' // Hostname
        );
        console.log('✅ Vercel platform added:', vercelPlatform);

        // Add localhost for development
        const localhostPlatform = await projects.createPlatform(
            '68833c43001b6aa15f16',
            'web',
            'Localhost Development',
            '',
            '',
            'localhost'
        );
        console.log('✅ Localhost platform added:', localhostPlatform);

        console.log('\n🎉 All platforms added successfully!');
        console.log('You can now access your app from:');
        console.log('- https://vadi-e-kashmir.vercel.app');
        console.log('- http://localhost:3000');
        
    } catch (error) {
        console.error('❌ Error adding platform:', error.message);
        console.error('\nMake sure:');
        console.error('1. Your APPWRITE_API_KEY is set in .env file');
        console.error('2. The API key has proper permissions');
    }
}

addPlatform();
