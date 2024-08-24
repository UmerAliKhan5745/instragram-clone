import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { AtSign, Badge, Heart, MessageCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useGetUserProfile } from '../hooks/useGetUserProfile'

// Define types
interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

interface Post {
  _id: string;
  image: string;
}

interface UserProfile extends User {
  posts: Post[];
  bookmarks: Post[];
  followers: string[];
  followings: string[];
  bio: string;
}

interface Params extends Record<string, string | undefined> {
  id: string;
}

// Define RootState
interface RootState {
  auth: {
    user: User | null;
    suggestedUsers: User[];
    userProfile: UserProfile | null;
    post: Post[];
  };
}

function Profile() {
  const { id: userId } = useParams<Params>();
  
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = React.useState('posts');
  const { userProfile, user } = useSelector((state: RootState) => state.auth);

  console.log(user, 'userProfile');
  const isLoggedInUserProfile = userProfile && userId === userProfile._id;
  const isFollowings = false;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  }

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className='flex flex-col gap-20 p-8'>
      <div className='grid grid-cols-2'>
        <section className='flex items-center justify-center'>
          <Avatar className='h-32 w-32'>
            <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </section>
        <section>
          <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-2'>
              <span>{userProfile?.username}</span>
              {
                isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
                    <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
                    <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>
                  </>
                ) : (
                  isFollowings ? (
                    <>
                      <Button variant='secondary' className='h-8'>Unfollow</Button>
                      <Button variant='secondary' className='h-8'>Message</Button>
                    </>
                  ) : (
                    <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
                  )
                )
              }
            </div>
            <div className='flex items-center gap-4'>
              <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
              <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
              <p><span className='font-semibold'>{userProfile?.followings.length} </span>following</p>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
              <Badge className='w-fit'><AtSign /> <span className='pl-1'>{userProfile?.username}</span></Badge>
            </div>
          </div>
        </section>
      </div>
      
      <div className='flex justify-center'>
        <div className='w-1/2 border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-10 text-sm'>
            <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}>
              POSTS
            </span>
            <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}>
              SAVED
            </span>
            <span className='py-3 cursor-pointer'>REELS</span>
            <span className='py-3 cursor-pointer'>TAGS</span>
          </div>
        </div>
      </div>
      
      <div className='flex justify-center'>
        <div className='grid grid-cols-3 gap-4'>
          {displayedPost?.map((post: Post) => (
            <div key={post._id} className='relative group cursor-pointer'>
              <img 
                src={post.image} 
                alt='postimage' 
                className='rounded-sm w-48 aspect-square object-cover' 
              />
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <div className='flex items-center text-white space-x-4'>
                  <button className='flex items-center gap-2 hover:text-gray-300'>
                    <Heart />
                  </button>
                  <button className='flex items-center gap-2 hover:text-gray-300'>
                    <MessageCircle />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Profile;
