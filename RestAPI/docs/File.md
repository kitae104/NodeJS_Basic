1. npm install --save multer

2. const multer = require('multer'); 

3. 기본 설정 
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // 이미지 저장 경로
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4())  // 파일명 중복 방지를 위한 uuid
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

4. 미들웨어 추가 
app.use(        
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")  // 이미지 업로드 설정
);

5. 컨트롤러에 기능 추가 
// 파일 처리 
if (!req.file) {    // 파일이 없을 경우
  const error = new Error('No image provided.');
  error.statusCode = 422;
  throw error;
}

const title = req.body.title;
const content = req.body.content;
const imageUrl = req.file.path;  // 이미지 파일 경로

const post = new Post({
  title: title,
  content: content,    
  imageUrl: imageUrl, // 이미지 파일 경로
  creator: { name: 'Kitae' },
});

6. React에 이미지 처리 부분 추가 
// 이미지 처리를 위해 FormData 객체를 사용
const formData = new FormData();  // 이미지 전송을 위해 FormData 객체 생성
formData.append('title', postData.title);
formData.append('content', postData.content);
formData.append('image', postData.image);

let url = 'http://localhost:8080/feed/post';
let method = 'POST';  
if (this.state.editPost) {
  url = 'URL';
}

fetch(url, {
  method: method,       
  body: formData,
})