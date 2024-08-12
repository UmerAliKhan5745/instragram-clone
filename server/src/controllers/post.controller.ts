import { Comment } from "../models/comment.model";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import cloudinary from "../utils/cloudinary";
const sharp = require('sharp');


export const addNewPost = async (req: any, res: any) => {
    try {

        const { caption } = req.body;
        const image = req.file;
        const author = req.id;
        if (!image) return res.status(400).json({ success: false, messsage: "post not fouud" })
        // image upload 
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        // buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);


        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url, // Save only the URL
            author
        })
        await post.populate('author', '-password')
        const user = await User.findById(author)
        if (user) {
            user.posts.push(post.id)
            user.save()
        }

        return res.status(200).json({ message: "post created  successfullly", status: true, post })

    } catch (err) {
        console.log(err)

    }
}

export const getAllPost = async (req: any, res: any) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: 'author', select: "username profilePicture" })
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    select: "username profilePicture"
                }
            })
        posts.forEach((post: any) => {
            post.comments.sort((a: any, b: any) => b.createdAt - a.createdAt);
        });


        return res.status(200).json({
            success: true,
            posts
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error', success: false });
    }
};

export const getUserPost = async (req: any, res: any) => {
    try {
        const author = req.id;

        const userPost = await Post.find({ author }).sort({ createdAt: -1 })
            .populate('author', 'username profilePicture')
            .populate(
                {
                    path: 'comments',
                    populate: {
                        path: "author",
                        select: "username profilePicture"
                    }
                }
            )
        userPost.forEach((post: any) => {
            post.comments.sort((a: any, b: any) => a.createdAt - b.createdAt)
        })

        return res.status(200).json({
            success: true,
            userPost
        })

    } catch (error) {
        console.log(error)
    }
}

export const likePost = async (req: any, res: any) => {
    try {
        const likeKarnaWala = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if (!post) { return res.status(400).json({ success: false, message: "post not found" }) }


        await post.updateOne({ $addToSet: { likes: likeKarnaWala } });
        await post.save()
        const user = await User.findById(likeKarnaWala).select('username profilePicture')
        const postOwnerId = post.author.toString();
        if (likeKarnaWala !== postOwnerId) {
            // notification login
        }
        return res.json({ success: true, message: "post like successfully", post })
    } catch (error) {
        console.log(error)
    }
}

export const dislikePost = async (req: any, res: any) => {
    try {
        const likeKarnaWala = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if (!post) { return res.status(400).json({ success: false, message: "post not found" }) }


        await post.updateOne({ $pull: { likes: likeKarnaWala } });
        await post.save()
        const user = await User.findById(likeKarnaWala).select('username profilePicture')
        const postOwnerId = post.author.toString();
        if (likeKarnaWala !== postOwnerId) {
            // notification login
        }
        return res.json({ success: true, message: "post dislikePost successfully", post })
    } catch (error) {
        console.log(error)
    }
}

export const addComment = async (req: any, res: any) => {
    try {
        const postId = req.params.id;
        const commentKarnaWalaKiId = req.id;
        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!post) return res.status(400).json({ success: false, message: "post Not found" })
        if (!text) return res.status(400).json({ success: false, message: "pls enter some text" })

        const comment = await Comment.create({
            text,
            author: commentKarnaWalaKiId,
            post: postId
        })

        await comment.populate('author', 'username profilePicture')
        post.comments.push(comment.id)
        await post.save()

        return res.status(200).json({
            success: true,
            message: "commint added",
            comment
        })


    } catch (error) {
        console.log(error)
    }
}

export const getCommentsOfPost = async (req: any, res: any) => {
    try {

        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate('author', 'username profilepicture')
        console.log(comments)
        if (!comments) return res.status(400).json({ success: false, message: "no comment on this post " })
        return res.status(200).json({ success: true, comments });
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async (req: any, res: any) => {
    try {
        const postId = req.params.id;
        const postAuthor = req.id;
        const deletePost = await Post.findById(postId)
        if (!deletePost) return res.status(400).json({ success: false, message: "post not found" })

        if (deletePost.author.toString() !== postAuthor) return res.status(401).json({ success: false, message: "unAuthorized prrson" })

        await Post.findByIdAndDelete(deletePost)
        let user = await User.findById(postAuthor);
        if (user) {
            user.posts = user.posts.filter(id => id.toString() !== postId)
            user.save()
        } await Comment.deleteMany({ post: postId })
        return res.status(200).json({ success: true, message: "post deleted" })

    } catch (error) {

    }
}

export const bookmarkPost = async (req: any, res: any) => {
    try {
        const bookMarkPostId = req.params.id;
        const author = req.id;
        const post = await Post.findById(bookMarkPostId)
        if (!post) return res.status(400).json({ success: false, message: "post not found" })
        const user = await User.findById(author)
        if (user?.bookmarks.includes(post.id)) {
            await user.updateOne({ $pull: { bookmarks: bookMarkPostId } })
           await  user.save()
            return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmark', success: true });
        }else{
            await user?.updateOne({ $addToSet: { bookmarks: bookMarkPostId } })
            await user?.save()
            return res.status(200).json({ type: 'saved', message: 'Post saved from bookmark', success: true });
        }

    } catch (error) {

    }
}




