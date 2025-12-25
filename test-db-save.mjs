// Test TRPC mutation from server side
// Node 22 has built-in fetch
async function testDatabaseSave() {
  const testData = {
    nodeAddress: "TEST-NODE-123:9001",
    stats: { file_size: 2000000000, test: true },
    accessible: true,
    nodePubkey: "TestPubkey123"
  };

  console.log('Testing TRPC mutation with data:', testData);

  // Direct POST with input in body (not batch format)
  try {
    const response = await fetch('http://localhost:3000/api/trpc/persistence.saveNodeStats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);

    if (response.ok) {
      console.log('✅ Database save successful!');
    } else {
      console.log('❌ Database save failed');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDatabaseSave();
