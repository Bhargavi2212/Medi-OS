const jwt = require('jsonwebtoken');

// Test JWT signing and verification
const payload = {
  userId: 1,
  username: 'testuser',
  email: 'test@example.com',
  roleId: 1,
  roleName: 'user'
};

const secret = 'fallback-secret';

console.log('🔧 Testing JWT signing and verification...');

try {
  // Sign the token
  const token = jwt.sign(payload, secret, { expiresIn: '24h' });
  console.log('✅ Token signed successfully:', token.substring(0, 50) + '...');

  // Verify the token
  const decoded = jwt.verify(token, secret);
  console.log('✅ Token verified successfully:', decoded);

  // Test with the same secret as in the service
  const serviceSecret = process.env.JWT_SECRET || 'fallback-secret';
  const serviceToken = jwt.sign(payload, serviceSecret, { expiresIn: '24h' });
  console.log('✅ Service token signed successfully');

  const serviceDecoded = jwt.verify(serviceToken, serviceSecret);
  console.log('✅ Service token verified successfully:', serviceDecoded);

} catch (error) {
  console.error('❌ JWT error:', error.message);
} 