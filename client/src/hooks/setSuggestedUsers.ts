import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setsuggestedUsers } from "../redux/authSlice";

const useFetchSuggestedUsers = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const response = await axios({
                    method: 'get',
                    url: 'http://localhost:4000/api/v1/user/suggested',
                    withCredentials: true,
                });
                if (response.data.success) {
                    dispatch(setsuggestedUsers(response.data.suggestedUser));
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchSuggestedUsers();
    }, [dispatch]);
};

export default useFetchSuggestedUsers;
