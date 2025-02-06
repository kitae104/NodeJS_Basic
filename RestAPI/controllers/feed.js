// feed 컨트롤러
const { validationResult } = require("express-validator"); // 검증 결과 확인

const fs = require("fs"); // 파일 시스템
const path = require("path"); // 경로

const Post = require("../models/post"); // Post 모델 불러오기

exports.getPosts = (req, res, next) => {

  const currentPage = req.query.page || 1; // 현재 페이지
  const perPage = 2; // 페이지당 게시물 수
  let totalItems; // 전체 게시물 수
  Post.find() // Post 모델에서 모든 데이터 검색
    .countDocuments() // 전체 게시물 수
    .then(count => {
      totalItems = count; // 전체 게시물 수 
      return Post.find() // Post 모델에서 모든 데이터 검색
        .skip((currentPage - 1) * perPage) // 건너뛸 데이터 수
        .limit(perPage); // 제한 데이터 수
    })
    .then((posts) => {   // 검색 결과가 있으면 반환
      res.status(200).json({
        message: "Fetched posts successfully.",
        posts: posts,
        totalItems: totalItems
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // 에러 핸들러로 전달
    });  
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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

  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path.replace("\\", "/"); // 이미지 파일 경로

  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl, // 이미지 파일 경로
    creator: { name: "Kitae" },
  });

  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Post created successfully!",
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
      if (!post) {   // 검색 결과가 없으면 에러 발생
        const error = new Error("Could not find post.");
        error.statusCode = 404;
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
    .then((result) => { // 결과 반환    
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
      if (!post) { // 검색 결과가 없으면 에러 발생
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      clearImage(post.imageUrl); // 이미지 파일 삭제
      return Post.findByIdAndRemove(postId); // 삭제
    })
    .then((result) => { // 결과 반환
      console.log(result);
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