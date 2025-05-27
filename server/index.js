require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { userRouter } = require("./routes/user");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());
app.use("/api/v1", userRouter);

// 🔐 Secure environment variables
const MERCHANT_ID = process.env.MERCHANT_ID;
const MERCHANT_KEY = process.env.MERCHANT_KEY;

// ✅ Production endpoints
const MERCHANT_BASE_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
const MERCHANT_STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status";

const redirectUrl = `${process.env.BACKEND_URL}/status`;
const successUrl = `${process.env.FRONTEND_URL}/payment-success`;
const failureUrl = `${process.env.FRONTEND_URL}/payment-failure`;

app.post("/create-order", async (req, res) => {
  const { name, mobileNumber, amount } = req.body;
  const orderId = uuidv4();
  const fullPhone = `+91${mobileNumber}`;

  const paymentPayload = {
    merchantId: MERCHANT_ID,
    merchantUserId: name,
    mobileNumber: mobileNumber,
    amount: Number(amount) * 100, // 💰 Amount in paise
    merchantTransactionId: orderId,
    redirectUrl: `${redirectUrl}?id=${orderId}&phone=${encodeURIComponent(fullPhone)}`,
    redirectMode: "POST",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString("base64");
  const keyIndex = 1;
  const stringToHash = payload + "/pg/v1/pay" + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  try {
    const response = await axios.post(MERCHANT_BASE_URL, {
      request: payload,
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": MERCHANT_ID,
      },
    });

    const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;
    return res.status(200).json({ url: redirectUrl });
  } catch (error) {
    console.error("PhonePe Payment Error:", error?.response?.data || error.message);
    return res.status(500).json({ error: "Failed to initiate payment" });
  }
});

app.post("/status", async (req, res) => {
  const merchantTransactionId = req.query.id;
  const phone = req.query.phone;

  const keyIndex = 1;
  const path = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
  const stringToHash = path + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  try {
    const response = await axios.get(`${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": MERCHANT_ID,
      },
    });

    const status = response.data?.data?.state;
    const responseCode = response.data?.data?.responseCode;
    const transactionId = response.data?.data?.transactionId;

    if (status === "COMPLETED" && responseCode === "SUCCESS") {
      return res.redirect(`${successUrl}?transactionId=${transactionId}&phone=${phone}`);
    } else {
      return res.redirect(failureUrl);
    }
  } catch (err) {
    console.error("Status Check Error:", err?.response?.data || err.message);
    return res.redirect(failureUrl);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
