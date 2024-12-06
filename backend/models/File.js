const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }
});

require("dotenv").config();

fileSchema.post("save", async function(doc){
    try {
        console.log(doc);
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        let info = await transporter.sendMail({
            from: `Vatsal`,
            to: doc.email,
            subject: `New File Uploaded on Cloudinary`,
            html: `<h2>Helllo</h2> <p>File Uploaded</p>`,
        })

        console.log(info);
        
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success:false,
            messagee:"Unable to send mail",
        })
    }
})

const File = mongoose.model("File", fileSchema);
module.exports = File;