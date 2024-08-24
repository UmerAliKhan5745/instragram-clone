import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useSelector, useDispatch } from 'react-redux';
import { Textarea } from './ui/textarea';
import { readFileAsDataURL } from '../lib/utils';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { setPost } from '../redux/postSlice';
import { toast } from 'sonner';

function CreatePost({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const imageRef: any = useRef();
  const dispatch = useDispatch()

  const [caption, setCaption] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [file, setFile] = useState('')
  const [loading, isLoading] = useState(false)
  const userInfo = useSelector((state: any) => { return state.auth })
  const posts = useSelector((state: any) => { return state.post })
  const { user } = userInfo


  const fileChangeHandler = async (e: any) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const dataUrl: any = await readFileAsDataURL(file)
      setImagePreview(dataUrl)
    }
  }
  const config = {
    headers: {
      "Content-Type": 'multipart/form-data'
    },
    withCredentials: true
  };

  const createPostHandler = async () => {
    const formData = new FormData();
    formData.append('caption', caption);
    if (imagePreview) formData.append('image', file);

    try {
      isLoading(true);
      const response = await axios({
        method: 'post',
        url: 'http://localhost:4000/api/v1/post/addpost',
        data: formData,  // Include formData as data
        ...config
      });


      if (response.data.success) {
        dispatch(setPost([response.data.post, ...posts]));
        toast.success(response.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading(false);
    }
  };


  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>

          <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
          <div className='flex gap-3 items-center'>
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="img" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='font-semibold text-xs'>{user?.username}</h1>
              <span className='text-gray-600 text-xs'>Bio here...</span>
            </div>
          </div>
          <Textarea value={caption} onChange={(e: any) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />

          {
            imagePreview && (
              <div className='w-full h-64 flex items-center justify-center'>
                <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
              </div>
            )
          }

          <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
          <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] '>Select from computer</Button>

          {
            imagePreview && (
              loading ? (
                <Button>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </Button>
              ) : (
                <Button onClick={createPostHandler} type="submit" className="w-full">Post</Button>
              )
            )
          }
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreatePost;
