const { validate } = require('@mailtester/core');

async function test() {
  console.log('Testing @mailtester/core with Node', process.version);
  console.log('===========================================');

  const testEmails = [
    'test@example.com',
    'invalid-email',
    'user@domain.com',
    'test@nonexistent-domain-12345.com'
  ];

  for (const email of testEmails) {
    try {
      console.log(`\nTesting: ${email}`);
      const result = await validate(email);
      console.log('Result:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  console.log('\n===========================================');
  console.log('Test completed successfully!');
}

test().catch(console.error);
