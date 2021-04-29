const router = require('express').Router();
const { BlogPost, User } = require("../models");
const withAuth = require('../utils/auth');

//get all blog posts
router.get('/', async (req, res) => {
    try {
        const blogPost = await BlogPost.findAll({})
        const allPost = blogPost.map((post) => post.get({ plain: true }));
        res.render("homepage", { post: allPost })
    } catch (err) {
        res.status(400).json(err);
    }
});

//get one blog post by id 
router.get('/post/:id', async (req, res) => {
    try {
        const blogPost = await BlogPost.findByPk(req.params.id, {
            include: [
                {
                    model: User,
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
});

//find logged in user's dashboard
// router.get('/dashboard', withAuth, async (req, res) => {
//     try {
//         // Find the logged in user based on the session ID
//         const userData = await User.findByPk(req.session.user_id, {
//             //don't include password column
//             attributes: { exclude: ['password'] },
//             include: [{ model: BlogPost }],
//         });

//         const blogPost = await BlogPost.findByPk({})
//         console.log(blogPost);
//         const userPost = blogPost.map((post) => post.get({ plain: true }));

//         res.render('dashboard', {
//             ...userPost,
//             logged_in: true
//         });
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

router.get("/dashboard", withAuth, async (req, res) => {
    try {
        const postData = await BlogPost.findAll({
            // where: {
            //     userId: req.session.userId,
            // },
            include: [
                // {
                //     model: Comments,
                // },
                {
                    model: User,
                    attributes: ["name"],
                },
            ],
        });
        const posts = postData.map((post) => post.get({ plain: true }));
        res.render("dashboard", {
            posts,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

//log in 
router.get('/login', (req, res) => {
    // if (req.session.logged_in) {
    //     res.redirect('/logout');
    //     return;
    // }

    res.render('login');
});

module.exports = router