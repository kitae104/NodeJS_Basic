const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');  // 헤더에서 토큰 추출
  if(!authHeader) { 
    const error = new Error('인증되지 않았습니다.');
    error.statusCode = 401;
    throw error
  }

  const token = authHeader.split(' ')[1]; // 헤더에서 토큰 추출
  let decodedToken;
  
  try {
    decodedToken = jwt.verify(token, 'kitae_secret'); // 토큰 검증
  } catch (err) {
    err.statusCode = 500;
    throw err;
  } 

  if (!decodedToken) {
    const error = new Error('인증되지 않은 사용자입니다.');
    error.statusCode = 401;
    throw error;
  } 

  req.userId = decodedToken.userId; // 사용자 ID  
  next();
};