import { Badge, MoreHorizontal, Bookmark, MessageCircle, Send } from 'lucide-react';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import React, { useState } from 'react';
import CommentDialog from './CommentDialog';
import axios from 'axios';
import { setPost } from '../redux/postSlice';
import { toast } from 'sonner';

function Post({ post }:any) {
  const posts = useSelector((state: any) => state.auth.post)
  const { user } = useSelector((state:any) => state.auth || {});
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLiked] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [text, setText] = useState("");

  const dispatch=useDispatch()
const changeEventHandler=(e:any)=>{
  let inputText=e.target.value;
  if(inputText.trim()){
    setText(inputText)
  }else{
    setText('')
  }

}

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This should be part of the config object
};

const commentHandler = async() => {
  try {
    const response = await axios({
      method: 'post',
      url:`http://localhost:4000/api/v1/post/comment/${post._id}`, 
      data: { text }, // Make sure text is sent as an object
      ...config, // Spread config object here
    });
if(response.data.success){

  const updatedComments=[...comment,response.data.comment]
setComment(updatedComments)    
  const upDatedPostData = posts.map((p:any)=>{
    p._id===post._id?{...p,comments:upDatedPostData}:p
  })
  dispatch(setPost(upDatedPostData))
  toast.success(response.data.message);
  setText("");
}
    // Handle the response (e.g., updating UI, state, etc.)
  } catch (error) {
    console.error('Error posting comment:', error);
    // Handle the error (e.g., show error message to the user)
  }
};

  const bookmarkHandler=async()=>{
    try {
      const responce=await axios({method:"get",url:`http://localhost:4000/api/v1/post/bookmark/${post._id}`,withCredentials:true})
      if(responce.data.success){
        toast.success(responce.data.message);

      }
    } catch (error) {
      console.log(error)
    }
  }
  const likeOrDislikeHandler=async()=>{
try {
  const action=liked?"dislike":"like";
const responce=await axios({
  method: 'get',
  url: `http://localhost:4000/api/v1/post//${action}/${post._id}`,
  withCredentials: true,})

  if(responce.data.success){
    const upDatedLike = liked ? postLike -1 : postLike + 1;

    setPostLiked(upDatedLike)
    setLiked(!liked)

    const ubdatedPostData=posts.map((p:any)=>{
      p._id===post._id?{
        ...p,
        likes:liked?p.likes.filter((id:any)=>id!==user._id):[...p.likes,user._id]
      }:p
    })
    dispatch(setPost(ubdatedPostData))
    toast.success(responce.data.message);
    setText('')

  }

} catch (error) {
  
}    
  }

  return (
    <div className='my-8 w-full max-w-sm mx-auto'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img
            alt="User profile"
            src={post.author?.profilePicture}
            className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
          />
          <div className='flex items-center gap-3'>
            <h1>{post.author?.username}</h1>
            {user?._id === post.author._id && <Badge className="bg-secondary">Author</Badge>}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="p-6 bg-white rounded-lg shadow-lg flex flex-col items-center text-sm text-center space-y-4">
            {post?.author?._id !== user?._id && (
              <button type="button" className="cursor-pointer w-fit text-[#ED4956] font-bold">
                Unfollow
              </button>
            )}
            <button type="button" className="cursor-pointer w-fit">
              Add to favorites
            </button>
            {user && user?._id === post?.author._id && (
              <button type="button" className="cursor-pointer w-fit">
                Delete
              </button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <img
        className='rounded-sm my-2 w-full aspect-square object-cover'
        src={post.image}
        alt="post_img"
      />

      <div className='flex items-center justify-between my-2'>
        <div className='flex items-center gap-3'>
          <div >
            {liked ? (
              <FaHeart size={'24'} onClick={likeOrDislikeHandler} className='cursor-pointer text-red-600' />
            ) : (
              <FaRegHeart size={'22px'}onClick={likeOrDislikeHandler}  className='cursor-pointer hover:text-gray-600' />
            )}
          </div>
          <MessageCircle className='cursor-pointer hover:text-gray-600' />
          <Send className='cursor-pointer hover:text-gray-600' />
        </div>
        <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' />
      </div>

      <span className='font-medium block mb-2'>{postLike} likes</span>

      <p>
        <span className='font-medium mr-2'>{post.author?.username}</span>
        {post.caption}
      </p>

      {comment.length > 0 && (
        <span className='cursor-pointer text-sm text-gray-400'>
          View all {comment.length} comments
        </span>
      )}

      <CommentDialog />

      <div className='flex items-center justify-between'>
        <input
          type="text"
          placeholder='Add a comment...'
          value={text}
          onChange={changeEventHandler}
          className='outline-none text-sm w-full'
        />
        {text && (
          <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
