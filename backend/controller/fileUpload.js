const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

exports.localFileUpload = async (req, res) => {
    try {
        const file = req.files.file;
        console.log("File: ", file);

        let path = __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
        console.log("Path: ", path);
        
        file.mv(path, (error) => {
            console.log(error);
        })

        res.json({
            success:true,
            message:'Local File Uploaded Successfully',
        })
        
    } catch (error) {
        console.log(error);
    }
}

function supportedFileType(fileType, supportedTypes){
    return supportedTypes.includes(fileType);
}

async function uploadToCloudinary(file, folder, quality){
    const options = {folder};
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async(req, res) => {
    try {
        // data fetch
        const {name, email, tags} = req.body;
        console.log(name,email,tags);

        const file = req.files.imageFile;
        console.log(file);

        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!supportedFileType(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'File Format Not Supported',
            })
        }

        console.log("hello");

        const response = await uploadToCloudinary(file, "FileUpload");
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })

        res.status(200).json({
            success:true,
            imageUrl: response.secure_url,
            message:'Image Uploaded Successfully',
        })

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something Went Wrong',
        })
    }
}

exports.videoUpload = async(req, res) => {
    try {
        // data fetch
        const {name, email, tags} = req.body;
        console.log(name,email,tags);

        const file = req.files.videoFile;
        console.log(file);

        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!supportedFileType(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'File Format Not Supported',
            })
        }

        const response = await uploadToCloudinary(file, "FileUpload");
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })

        res.status(200).json({
            success:true,
            imageUrl: response.secure_url,
            message:'Video Uploaded Successfully',
        })

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something Went Wrong',
        })
    }
}

exports.imageSizeReducer = async(req, res) => {
    try {
        // data fetch
        const {name, email, tags} = req.body;
        console.log(name,email,tags);

        const file = req.files.imageFile;
        console.log(file);

        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!supportedFileType(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:'File Format Not Supported',
            })
        }

        const response = await uploadToCloudinary(file, "FileUpload", 30);
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url,
        })

        res.status(200).json({
            success:true,
            imageUrl: response.secure_url,
            message:'Image Uploaded Successfully',
        })

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something Went Wrong',
        })
    }
}