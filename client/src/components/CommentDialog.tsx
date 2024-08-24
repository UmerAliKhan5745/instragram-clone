import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar } from '@radix-ui/react-avatar'
import { AvatarFallback, AvatarImage } from './ui/avatar'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import Comment from './Comment'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { setPost } from '../redux/postSlice'

function CommentDialog({ open, setOpen }: any) {
  const dispatch = useDispatch();

  const selectedPost = useSelector((state: any) => state.post.selectedPost)
  const [text, setText] = React.useState('')
  const [comment, setComment] = useState([])
  React.useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e:any) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }
  const sendMessageHandler = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:4000/api/v1/post/comment/${selectedPost?._id}`,
        data: { text }, // Use "data" to pass the request body
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log(res,'rres')
      if (res.data.success) {
        const updatedCommints: any = [...comment, res.data.comment]
        setComment(updatedCommints)

        const UpdatedPostData = updatedCommints.map((p: any) =>
          p.id === selectedPost.id ? { ...p, comments: updatedCommints } : p
        )
        dispatch(setPost(UpdatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error)

    }
  }
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-0 flex flex-col">
          <div className='flex flex-1'>
            <div className='w-1/2'>
              <img
                src={selectedPost?.image}
                alt="post_img"
                className='w-full h-full object-cover rounded-l-lg'
              />
            </div>
            <div className='w-full flex flex-col justify-between'>
              <div className='flex items-center justify-between p-4'>
                <div className='flex gap-3 items-center'>
                  <Link to={''}>
                    <Avatar>
                      <AvatarImage src={selectedPost?.author?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className='font-semibold text-xs' to={''}>{selectedPost?.author?.username}</Link>
                    {/* <span className='text-gray-600 text-sm'>Bio here...</span> */}
                  </div>
                </div>


                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className='cursor-pointer' />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center">
                    <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                      Unfollow
                    </div>
                    <div className='cursor-pointer w-full'>
                      Add to favorites
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />
              <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                {
                  comment.map((comment: any) => <Comment key={comment._id} comment={comment} />)
                }
              </div>
              <div className='p-4'>
                <div className='flex items-center gap-2'>
                  <input type="text" value={text} onChange={changeEventHandler} placeholder='Add a comment...' className='w-full outline-none border text-sm border-gray-300 p-2 rounded' />
                  <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">Send</Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default CommentDialog


