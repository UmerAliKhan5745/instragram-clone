import axios from 'axios'
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { toast } from "sonner";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setAuthUser } from '../redux/authSlice';
import { useState } from 'react';
import CreatePost from './CreatePost';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';


function LeftSidebar() {
    const dispatch = useDispatch();
    const nagviate = useNavigate()
    const [open, setOpen] = useState(false)
    const { user } = useSelector((state: any) => state.auth)
    const logOutHandler = async () => {
        try {
            const response = await axios({ method: "get", url: 'http://localhost:4000/api/v1/user/logout' })
            if (response.data.success) {
                dispatch(setAuthUser(null))
                toast.success(response.data.message);
                nagviate("/login");
                localStorage.removeItem('persist:root');
            }
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.message);

        }
    }


    const sideBarHandle = (textType: string) => {
        if (textType === 'Logout') {
            logOutHandler()
        }
        else if (textType === 'Create') {
            setOpen(true)
        }
        else if (textType === 'Profile') {
            nagviate(`/profile/${user._id}`)
        }
        else if (textType === 'Home') {
            nagviate('/')
        }
        else if (textType === 'Messages') {
            nagviate(`/chat`)
        }
    }

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        {
            icon: (
                <img src={user?.profilePicture}alt="@shadcn" className="w-10 h-10 rounded-full" />
                
            ),
            text: "Profile"
        }, { icon: <PlusSquare />, text: "Create" },
        { icon: <LogOut />, text: "Logout" },

    ]
    return (
        <>
            <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
                <div className='flex flex-col'>
                    <h1 className='my-8 pl-3 font-bold text-xl'>LOGO</h1>
                    <div>{
                        sidebarItems.map((items, index) => {

                            return (
                                <div onClick={() => { sideBarHandle(items.text) }} key={index} className='flex item-centre gap-3 reletive hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>

                                    {items.icon}
                                    <span>{items.text}</span>


                                </div>
                            )
                        })
                    }</div>
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </>
    )
}

export default LeftSidebar