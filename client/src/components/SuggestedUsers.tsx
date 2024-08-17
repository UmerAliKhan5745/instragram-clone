import { useSelector } from 'react-redux';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import useFetchSuggestedUsers from '../hooks/setSuggestedUsers';

const SuggestedUsers = memo(() => {
    useFetchSuggestedUsers()
    // Use useSelector to fetch suggested users from the Redux store
    const suggestedUsers = useSelector((state: any) => state.auth.suggestedUsers || []);
    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {suggestedUsers.map((user: any) => (
                <div key={user._id} className='flex items-center justify-between my-5'>
                    <div className='flex items-center gap-2'>
                        <Link to={`/profile/${user?._id}`}>
                            <img
                                alt="User profile"
                                src={user?.profilePicture}
                                className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                            />
                        </Link>
                        <div>
                            <h1 className='font-semibold text-sm'>
                                <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                            </h1>
                            <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span>
                </div>
            ))}
        </div>
    );
});

export default SuggestedUsers;
