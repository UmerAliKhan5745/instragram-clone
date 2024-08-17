import React from 'react'
import { useSelector } from 'react-redux'
import Post from './Post'
import useGetPost from '../hooks/getAllPost'

function Posts() {
  useGetPost()

  const posts = useSelector((state: any) => state.auth.post)
  return (
    <div>
      {
        posts.map((post: any) => <Post key={post._id} post={post} />)
      }
      </div>
  )
}

export default Posts