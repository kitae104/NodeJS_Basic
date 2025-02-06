# RestAPI 시작하기 

1. 프로젝트 시작하기  
- npm init 

2. 관련 패키지 설치 
- npm install --save express
- npm install --save-dev nodemon
- npm install --save body-parser(express로 대체)
- npm install --save figlet
- npm install --save express-validator
- npm install --save mongoose
- npm install --save dotenv
- npm install --save uuid
- npm install --save multer
- npm install --save bcryptjs

3. 실행 설정 
- "start": "nodemon app.js"

4. 윈도우 경로 확인 
- const imageUrl = req.file.path.replace("\\" ,"/");