const router = require('express').Router();
const Model = require("../models");

//get all blog posts
router.get('/', async (req, res) => {
    try {
        const blogPost = await Model.BlogPost.findAll({})
        const allPost = blogPost.map((post) => post.get({ plain: true }));
        res.render("homepage", { post: allPost })
    } catch (err) {
        res.status(400).json(err);
    }
});

//get one blog post by id
router.get('/post/:id', async (req, res) => {
    try {
        const blogPost = await Model.BlogPost.findByPk(req.params.id, {
            include: [
                {
                    model: Model.User,
                    attributes: ['name'],
                }
            ],
        })
        console.log(blogPost)
        const onePost = blogPost.get({ plain: true });
        res.render("post", onePost)
    } catch (err) {
        res.status(400).json(err);
    }
})

module.exports = router