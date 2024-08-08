import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    cloud_name: 'dkijboty1',
    api_key: '832338883694897',
    api_secret : 'Izsv6eOJdvH4dZWVEgCHP0FjBV0'
});
export default cloudinary;