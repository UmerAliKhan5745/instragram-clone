import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../utils/cloudinary';
import getDataUri from '../utils/dataUri';

interface UserRequest extends Request {
    body: {
        username: string;
        email: string;
        password: string;
    };
}

interface LoginRequest extends Request {
    _id: any;
    body: {
        email: string;
        password: string;
    };
}

export const register = async (req: UserRequest, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: 'Something is missing, please check!',
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: 'Try different email',
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: 'Account created successfully.',
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};

export const login = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: 'Something is missing, please check!',
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: 'Incorrect email or password',
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: 'Incorrect email or password',
                success: false,
            });
        }
        const userinfo = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            followings: user.followings,
            posts: user.posts
        }
        const token = jwt.sign({ userId: user._id }, 'omeralikhan', { expiresIn: '1d' });

        return res.cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            userinfo
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error',
            success: false,
        });
    }
};


export const logout = (req: any, res: any) => {

    try {
        return res.cookie("token", '', { maxAge: 0 }).json({
            message: "logged out successfully ",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}


export const getProfile = async (req: any, res: any) => {

    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
        return res.status(200).json({
            user,
            success: true
        })


    } catch (error) {
        console.log(error);
    }
}
export const editProfile = async (req: any, res: any) => {

    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse: any;
        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri as string);
        }

        const user = await User.findById(userId).select('-password')
        if (!user) {
            return res.status(404).json({
                message: "user not found",
                success: false
            })
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
}

export const getsuggestedUser = async (req: any, res: Response) => {
    try {

        const suggestedUser = await User.find({ _id: { $ne: req._id } }).select('-password');
        if (!suggestedUser) {
            return res.status(404).json({
                message: "currentely do not have any  suggested User",
                success: false
            })
        }

        return res.status(200).json({
            success: true,
            suggestedUser
        });


    } catch (error) {
        console.log(error);

    }

}



export const follewingandfollower=async(req:any,res:any)=>{
    try {
        const followKrneWala = req.id; // patel
        const jiskoFollowKrunga = req.params.id; // shivani
        if (followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }


        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);


        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }

        const isFollowing = user.followings.includes(jiskoFollowKrunga);
        if (isFollowing) {
            // unfollow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $pull: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $pull: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic ayega
            await Promise.all([
                User.updateOne({ _id: followKrneWala }, { $push: { following: jiskoFollowKrunga } }),
                User.updateOne({ _id: jiskoFollowKrunga }, { $push: { followers: followKrneWala } }),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}