import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    cloud_name: 'dkijboty1', //    process.env.API_KEY as string ,
    api_key: '832338883694897',//process.env.API_SECRET as string
    api_secret : 'Izsv6eOJdvH4dZWVEgCHP0FjBV0'  //process.env.CLOUDNAME as string

});
export default cloudinary;