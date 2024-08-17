import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllPost } from "../redux/authSlice";

// Rename to indicate it's a hook
const useGetPost = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: 'http://localhost:4000/api/v1/post/all',
                    withCredentials: true,
                });

                if (response.data.success) {
                    dispatch(getAllPost(response.data.posts));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchPost();
    }, [dispatch]);
};

export default useGetPost;
