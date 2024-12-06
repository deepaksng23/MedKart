const crypto = require("crypto");
const Razorpay = require("razorpay");
const { instance } = require("../config/razorpay");

exports.capturePayment = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        const { totalAmount } = req.body;

        const userId = req.user.id;
        console.log("User Id : ", req.user.id);

        if (isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).json({ message: "Invalid total amount" });
        }

        const options = {
            amount: (totalAmount * 100).toFixed(0), 
            currency: "INR",
            receipt: `r${userId}_${Date.now()}`,
        };

        console.log("Options : ", options);
        
        const order = await instance.orders.create(options);
        console.log("Razorpay Order created:", order);
         

        if (!order || !order.id) {
            throw new Error('Failed to create order');
        }

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Error capturing payment:', error.message);
        res.status(500).json({
            success: false,
            message: `Error capturing payment: ${error.message}`
        });
    }
};


exports.verifySignature = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // Generate signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // Compare signatures
        if (generatedSignature === razorpay_signature) {
            res.status(200).json({ success: true, message: "Payment verified successfully." });
        } else {
            res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        console.error("Error verifying payment signature:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
