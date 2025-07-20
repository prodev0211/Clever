const fetch = require('node-fetch');

async function testAuthAndGuilds() {
  try {
    console.log('🔍 Testing Authentication and Guilds API');
    console.log('========================================');
    
    // 1. Register a new user
    console.log('\n1. Registering new user...');
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser5',
        email: 'test5@example.com',
        password: 'password123'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Register response:', registerData);

    if (!registerData.tokens?.accessToken) {
      throw new Error('No access token received');
    }

    const accessToken = registerData.tokens.accessToken;
    console.log('✅ User registered successfully');

    // 2. Test guilds API with token
    console.log('\n2. Testing guilds API with token...');
    const guildsResponse = await fetch('http://localhost:5000/api/guilds', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    const guildsData = await guildsResponse.json();
    console.log('Guilds response:', guildsData);

    if (guildsResponse.ok) {
      console.log('✅ Guilds API working correctly');
    } else {
      console.log('❌ Guilds API failed:', guildsData);
    }

    // 3. Test creating a guild
    console.log('\n3. Testing create guild...');
    const createGuildResponse = await fetch('http://localhost:5000/api/guilds', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Guild',
        description: 'A test guild for testing'
      })
    });

    const createGuildData = await createGuildResponse.json();
    console.log('Create guild response:', createGuildData);

    if (createGuildResponse.ok) {
      console.log('✅ Create guild working correctly');
    } else {
      console.log('❌ Create guild failed:', createGuildData);
    }

    // 4. Test guilds API again to see the new guild
    console.log('\n4. Testing guilds API again...');
    const guildsResponse2 = await fetch('http://localhost:5000/api/guilds', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    const guildsData2 = await guildsResponse2.json();
    console.log('Guilds response (after create):', guildsData2);

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthAndGuilds();