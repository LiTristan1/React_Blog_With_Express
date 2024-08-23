const express = require('express');
const router = express.Router();
const postController =require('../../controllers/postController');
router.route('/')
.get(postController.getImagePost);

router.route('/:id')
    .patch(postController.updatePostColl)
    .get(postController.getUserPosts)
    .post(postController.insertImage);

module.exports = router;