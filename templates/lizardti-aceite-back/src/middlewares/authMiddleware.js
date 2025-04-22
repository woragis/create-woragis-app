const { CognitoJwtVerifier } = require('aws-jwt-verify');

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID,
  tokenUse: 'id',
  clientId: process.env.CLIENT_ID,
});

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const payload = await verifier.verify(token);
    req.user = payload; // Adiciona os dados do usuário à requisição
    next();
  } catch (err) {
    console.error('Token inválido:', err);
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = verifyToken;