export default async function handler(req, res) {
  try {
    // Import the serverless handler
    const { default: serverlessHandler } = await import('../dist/server.js');
    
    // Call the serverless handler
    return await serverlessHandler(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}