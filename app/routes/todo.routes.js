const express = require('express');
const router = express.Router();
const { todoController } = require('../controllers');
const { authJwt } = require('../middleware');

router.use(function(req, res, next) {
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, Content-Type, Accept',
        'Authorization'
    );
    next();
});

router.get('/', [authJwt.verifyToken], todoController.findAll);
router.post('/', [authJwt.verifyToken], todoController.create);
router.get('/:id', [authJwt.verifyToken], todoController.findOne);
router.put('/:id', [authJwt.verifyToken], todoController.update);
router.delete('/:id', [authJwt.verifyToken], todoController.remove);
router.put('/:id/done', [authJwt.verifyToken], todoController.setDone);

module.exports = router;

