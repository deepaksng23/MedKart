const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async(req, res) => {
  try {
      const { dateOfBirth = "", gender = "", about, contactNumber } = req.body;
      const id = req.user.id;

      const userDetails = await User.findById(id).populate("additionalDetails").exec();
      console.log("User: ", userDetails);

      const profile = await Profile.findById(userDetails.additionalDetails);

      profile.dateOfBirth = dateOfBirth;
      profile.about = about;
      profile.gender = gender;
      profile.contactNumber = contactNumber;

      console.log("Profile before saving: ", profile);

      await profile.save();

      const updatedProfile = await Profile.findById(profile._id);
      console.log("Updated Profile: ", updatedProfile);

      return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          profile: updatedProfile,
      });
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: "Unable to update profile",
      });
  }
};


exports.getAllUserDetails = async (req, res) => {
	try {
		const id = req.user.id;
		const userDetails = await User.findById(id)
			.populate("additionalDetails")
			.exec();     

		if (!userDetails) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "User Data fetched successfully",
			data: userDetails,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(`Deleting user with ID: ${id}`);

    const user = await User.findById(id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    console.log(`Found user: ${user}`);

    const profileId = user.additionalDetails;
    console.log(`Associated profile ID: ${profileId}`);

    const profile = await Profile.findById(profileId);
    if (!profile) {
      console.log('Profile not found');
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }
    console.log(`Found profile: ${profile}`);

    const deleteProfileResult = await Profile.findByIdAndDelete(profile);
    console.log(`Deleted profile result: ${deleteProfileResult}`);

    const deleteUserResult = await User.findByIdAndDelete(id);
    console.log(`Deleted user result: ${deleteUserResult}`);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "User cannot be deleted successfully" });
  }
};