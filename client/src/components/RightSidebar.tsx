import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SuggestedUsers from './SuggestedUsers';

function RightSidebar() {
    const authState = useSelector((state: any) => {
        return state.auth || {};
    });
    const { user } = authState;
    return (
        <>
            <div className='w-fit my-10 pr-32'>
                <div className='flex items-centre gap-2'>
                    <Link to={`/profile/${user?._id}`}>
                        <img
                            alt="post_image" src={user?.profilePicture}
                            className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                        />
                    </Link>
                    <div>
                        <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
                        <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                    </div>


                </div>
                <SuggestedUsers/>

            </div>
        </>
    )
}

export default RightSidebar