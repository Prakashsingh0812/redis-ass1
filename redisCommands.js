const redis = require('ioredis');

// Create a Redis client
const client = redis.createClient();

// Ensure Redis connection before running commands
async function connectRedis() {
  return new Promise((resolve, reject) => {
    client.on('connect', () => {
      console.log('Connected to Redis');
      resolve();
    });

    client.on('error', (err) => {
      console.log('Error connecting to Redis:', err);
      reject(err);
    });
  });
}

// Use async/await for Redis operations
async function runRedisCommands() {
  try {
    // Wait for the client to connect
    await connectRedis();

    // 2. Store a sample key-value pair in Redis
    const reply = await client.set('name', 'John Doe');
    console.log(reply);  // Should log "OK"
  
    // 3. Retrieve and log the stored value
    const value = await client.get('name');
    console.log('Stored Value:', value);  // Should log "John Doe"
  
    // 4. Set an expiration time (TTL) for the key
    const expireReply = await client.expire('name', 10);
    console.log('Expiration Set:', expireReply);  // Should log "1" (success)
  
    // 5. Check TTL
    const ttl = await client.ttl('name');
    console.log('TTL of "name":', ttl);  // Should log the remaining time to live

    // 6. Delete the key
    const delReply = await client.del('name');
    console.log('Delete status:', delReply);  // Should log "1" (success)
  
    // Verify the deletion
    const valueAfterDelete = await client.get('name');
    console.log('Value after deletion:', valueAfterDelete);  // Should log null

  } catch (err) {
    console.log('Error:', err);
  } finally {
    // Ensure client is quit after all operations are done
    await client.quit();
  }
}

// Run the commands
runRedisCommands();
