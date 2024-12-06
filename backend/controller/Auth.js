const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");

require("dotenv").config();

exports.signup = async(req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp
        } = req.body;

        console.log(firstName);

        // Data Validation
        if(!firstName || !lastName || !email || !password || !otp || !confirmPassword){
            return res.status(403).json({
                success: false,
                message: "Required data not present! Please fill all the details",
            });
        }

        // Password Matching
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Check if user is an existing user or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User Already Signed Up! Please Login"
            });
        }

        // Find out the most recent OTP Stored in the DB
        const response = await OTP.findOne({email}).sort({ createdAt: -1 }).limit(1);
        console.log("OTP Response", response);

        // Validate the OTP
        if (response.length === 0) {
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
        }
		else if (otp !== response.otp) {
			// Invalid OTP
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        const ProfileDetails = await Profile.create({
            dateOfBirth: null,
            about:null,
            contactNumber: null,
            gender: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            additionalDetails: ProfileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        return res.status(200).json({
            success: true,
            user,
            message: "User has been registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to register user! Please try again later"
        });
    }
}

// Login
exports.login = async(req, res) => {
    try{
        // data fetch
        const {email, password} = req.body;

        // data validation
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please fill up all the required details",
            })
        }

        // check if user is registered
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User Not Registered! Please signup first",
            })
        }

        // validate password & create jwt token
        if(await bcrypt.compare(password, user.password)){
            const token = jwt.sign(
                {
                    email: user.email,
                    id: user._id,
                },
				    process.env.JWT_SECRET,
				{
					expiresIn: "24h",
				}
            );

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 20*60*1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
				success: true,
				token,
				user,
				message: `User Login Success`,
			});
        }
        else {
			return res.status(401).json({
				success: false,
				message: `Password is incorrect`,
			});
		}

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to Login! Please try again later"
        });
    }
}

// sendOTP
exports.sendotp = async(req, res) => {
    try{
        // Data Fetch
        const {email} = req.body;
        console.log("Email : ", email);

        // Check if user already registered
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success: false,
                message: "User is already registered",
            });
        }

        var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

        console.log("OTP", otp);

        // OTP must be unique
        const result = await OTP.findOne({ otp: otp });
		console.log("OTP", otp);
		console.log("Result", result);

		const otpPayload = { email, otp };
		const otpBody = await OTP.create(otpPayload);
		console.log("OTP Body", otpBody);

		return res.status(200).json({
			success: true,
			message: `OTP Sent Successfully`,
			otp,
		});

    } catch(error){
        console.log(error.message);
		return res.status(500).json({
            success: false,
            message: 'OTP Issue',
        });
    }
}