// feed 컨트롤러
const { validationResult } = require("express-validator"); // 검증 결과 확인

const fs = require("fs"); // 파일 시스템
const path = require("path"); // 경로

const Post = require("../models/post"); // Post 모델 불러오기
const User = require("../models/user"); // User 모델 불러오기

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1; // 현재 페이지
  const perPage = 2; // 페이지당 게시물 수
  try{
    const totalItems = await Post.find().countDocuments(); // 전체 게시물 수
    const posts = await Post.find() // Post 모델에서 모든 데이터 검색
      .skip((currentPage - 1) * perPage) // 건너뛸 데이터 수
      .limit(perPage); // 제한 데이터 수
          
    res.status(200).json({
      message: "게시물을 성공적으로 가져왔습니다.",
      posts: posts,
      totalItems: totalItems,
    });
  }  
  catch(err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // 에러 핸들러로 전달
  }
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req); // 검증 결과 확인
  if (!errors.isEmpty()) {
    // 오류가 있으면
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  // 파일 처리
  if (!req.file) {
    // 파일이 없을 경우
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path.replace("\\", "/"); // 이미지 파일 경로
  const title = req.body.title;
  const content = req.body.content;
  let creator;

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl, // 이미지 파일 경로
    creator: req.userId, // 사용자 ID
  });

  post
    .save()
    .then((result) => {
      return User.findById(req.userId); // User 모델에서 사용자 ID로 검색
    })
    .then((user) => {
      creator = user; // 사용자 정보
      user.posts.push(post); // 게시물 추가
      return user.save(); // 사용자 정보 저장
    })
    .then((result) => {
      res.status(201).json({
        message: "Post를 성공적으로 생성했습니다.!",
        post: post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // 에러 핸들러로 전달
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId; // URL 파라미터에서 postId 추출
  Post.findById(postId) // Post 모델에서 postId로 검색
    .then((post) => {
      if (!post) {
        // 검색 결과가 없으면 에러 발생
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({
        message: "Post fetched.",
        post: post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // 에러 핸들러로 전달
    });
};

// 게시물 업데이트
exports.updatePost = (req, res, next) => {
  const postId = req.params.postId; // URL 파라미터에서 postId 추출
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title; // 제목
  const content = req.body.content; // 내용
  let imageUrl = req.body.image; // 이미지 파일 경로

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/"); // 이미지 파일 경로
  }
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId) // Post 모델에서 postId로 검색
    .then((post) => {
      if (!post) {
        // 검색 결과가 없으면 에러 발생
        const error = new Error("포스트를 찾을 수 없습니다.ㄹ");
        error.statusCode = 404;
        throw error;
      }     

      if (post.creator.toString() !== req.userId) {        // 사용자 ID 확인
        const error = new Error("인증되지 않았습니다!");
        error.statusCode = 403;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl); // 기존 이미지 파일 삭제
      }
      post.title = title; // 제목
      post.imageUrl = imageUrl; // 이미지 파일 경로
      post.content = content; // 내용
      return post.save(); // 저장
    })
    .then((result) => {
      // 결과 반환
      res.status(200).json({
        message: "Post updated!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // 에러 핸들러로 전달
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId; // URL 파라미터에서 postId 추출
  Post.findById(postId) // Post 모델에서 postId로 검색
    .then((post) => {
      if (!post) {
        // 검색 결과가 없으면 에러 발생
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {        // 사용자 ID 확인
        const error = new Error("인증되지 않았습니다!");
        error.statusCode = 403;
        throw error;
      }

      clearImage(post.imageUrl); // 이미지 파일 삭제
      return Post.findByIdAndDelete(postId); // 삭제
    })
    .then((result) => {  
      return User.findById(req.userId); // User 모델에서 사용자 ID로 검색
    })
    .then((user) => { 
      user.posts.pull(postId); // 게시물 삭제
      return user.save(); // 사용자 정보 저장
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // 에러 핸들러로 전달
    });
};

// 이미지 파일 삭제
const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath); // 파일 경로
  fs.unlink(filePath, (err) => console.log(err)); // 파일 삭제
};
