require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { userRouter } = require("./routes/user");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { log } = require("console");
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // your React/Vite frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/v1", userRouter);

const MERCHANT_KEY = process.env.MERCHANT_KEY;
const MERCHANT_ID = process.env.MERCHANT_ID;

// For Production
const MERCHANT_BASE_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay";
const MERCHANT_STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status";

// const MERCHANT_BASE_URL =
//   "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
// const MERCHANT_STATUS_URL =
//   "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";

const redirectUrl = "http://localhost:3000/status";

const successUrl = "http://localhost:5173/payment-success";
const failureUrl = "http://localhost:5173/payment-failure";

app.post("/create-order", async (req, res) => {
  const { name, mobileNumber, amount } = req.body;
  const orderId = uuidv4();

  console.log(
    "************************************",
    name,
    mobileNumber,
    amount,
    "************************************"
  );
  const fullPhone = `+91${mobileNumber}`;
  //payment
  const paymentPayload = {
    merchantId: MERCHANT_ID,
    merchantUserId: name,
    mobileNumber: mobileNumber,
    amount: amount * 100,
    merchantTransactionId: orderId,
    redirectUrl: `${redirectUrl}/?id=${orderId}&phone=${encodeURIComponent(
      fullPhone
    )}`,
    redirectMode: "POST",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString(
    "base64"
  );
  const keyIndex = 1;
  const string = payload + "/pg/v1/pay" + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  console.log("Encoded Payload:", payload);
  console.log("X-VERIFY Header:", checksum);

  const option = {
    method: "POST",
    url: MERCHANT_BASE_URL,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    data: {
      request: payload,
    },
  };
  try {
    const response = await axios.request(option);
    console.log(response.data.data.instrumentResponse.redirectInfo.url);
    res.status(200).json({
      msg: "OK",
      url: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.log("error in payment", error);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

app.post("/status", async (req, res) => {
  const merchantTransactionId = req.query.id;
  const phone = req.query.phone;

  console.log("User Phone Number", phone);

  const keyIndex = 1;
  const string =
    `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const option = {
    method: "GET",
    url: `${MERCHANT_STATUS_URL}/${MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": MERCHANT_ID,
    },
  };

  try {
    const response = await axios.request(option);
    console.log(
      "Full PhonePe status response:",
      JSON.stringify(response.data, null, 2)
    );

    const status = response.data?.data?.state;
    const responseCode = response.data?.data?.responseCode;
    const transactionId = response.data?.data?.transactionId;

    console.log("Transaction State:", status);
    console.log("Response Code:", responseCode);

    if (status === "COMPLETED" && responseCode === "SUCCESS") {
      console.log("Transaction Details", transactionId);

      return res.redirect(
        `${successUrl}?transactionId=${transactionId}&phone=${phone}`
      );
    } else {
      return res.redirect(failureUrl);
    }
  } catch (err) {
    console.error("Payment status check error:", err);
    return res.redirect(failureUrl);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}`);
});
