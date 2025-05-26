const express = require("express");
const userRouter = express.Router();
const twilio = require("twilio");
const { db, docRef } = require("../configs/firebase"); // adjust path if needed
require("dotenv").config();
const Razorpay = require("razorpay");
const multer = require("multer");
const storage = multer.memoryStorage(); // or use diskStorage if you want to save to disk
const upload = multer({ storage });

const client = new twilio(
  process.env.YOUR_ACCOUNT_SID,
  process.env.YOUR_AUTH_TOKEN
);

const tempUsers = {
  "+919097989707": {
    userData: {
      title: "Mr",
      FirstName: "Ravi",
      LastName: "Kumar",
      Phone: "+919097989707",
      email: "ravi@example.com",
    },
    otp: 123456,
  },
};

userRouter.post("/step-one", async (req, res) => {
  const { title, FirstName, LastName, Phone, email } = req.body;

  const memberships = [
    {
      id: "LM",
      title: "Life Member (LM).",
      eligibility: `A person is eligible for life membership if he or she has the minimum educational qualifications:
M.Sc. Dietetics / M.Sc. Nutrition / M.Sc. Dietetics & Nutrition / M.Sc. Nutrition and Dietetics / M.Sc. Dietetics & Food Service Management / M.Sc. Clinical Nutrition and Dietetics / M.Sc. Food, Nutrition and Dietetics / M.Sc. Food Science and Nutrition / M.Sc. Food and Nutrition from a recognized university plus six months of internship.
​After qualifying the eligibility criteria for Registered Dietician (RD), the life member can avail of RD membership.`,
      price: "	₹ 2500 /-",
      amount: 2500,
      documents: [
        "Soft copies of all marksheet/degree of academic qualifications, internships, or training and updated curriculum vitae (CV).",
        "Details of your work experience.",
        "A soft copy of a passport-size recent photograph in colour.",
        "Credit, debit card, UPI, or net banking details are needed to complete the payment.",
      ],
      benefits: [
        "A downloadable official BDA Certificate of Membership.",
        "Use of the website for member activities and e-learning.",
        "Reduced subscription rates to conferences, seminars, workshops, symposiums, courses, and journals.",
        "Reduced entrance fees to international, national, and affiliated regional meetings by BDA.",
        "Regular e-newsletters on various topics pertaining to dietetics and nutrition.",
      ],
      additionalBenefits: [
        "Apply for the Centre of Excellence and Fellowship in the Dietetics and Nutrition field.",
        "Life Members shall be entitled to participate in all activities of the BDA.",
        "Life Members will be eligible to be officers of the BDA.",
        "Award of appreciation to the individuals who have made extraordinary contributions to the hospital, research, and health administration.",
      ],
    },
    {
      id: "CM",
      title: "Corporate Membership (CM)",
      eligibility: `Any non-government organization (NGO) or institution teaching or disseminating education in dietetics, nutrition, food technology, or food and nutrition science that the association recognizes is eligible to become an institutional member by paying a one-time entry fee to Head Quarters.`,
      price: "₹ 2,00,000/-",
      amount: 200000,
      documents: [
        "Soft copies of the registration certificate.",
        "A soft copy of a passport-size photograph of Director/Proprietor.",
        "Name of Company/Organization.",
        "CIN/Registration No.",
        "Head Office Address.",
      ],
      benefits: [
        "A downloadable official BDA Corporate Membership Certificate.",
        "Use of the BDA name and logo for activities.",
        "Branding and visibility on the website.",
        "A platform to collaborate with the dieticians and use their expertise in research and development.",
        "Regular e-newsletters on various topics pertaining to dietetics and nutrition.",
      ],
    },
  ];

  async function saveMembershipsToFirestore(db, memberships) {
    try {
      const batch = db.batch();
      const membershipsCollection = db.collection("subscriptions");

      memberships.forEach((membership) => {
        const docRef = membershipsCollection.doc(membership.id);
        batch.set(docRef, membership);
      });

      await batch.commit();

      return { success: true, message: "Membership data saved successfully!" };
    } catch (error) {
      console.error("Error saving memberships:", error);
      return {
        success: false,
        message: "Failed to save memberships",
        error: error.message,
      };
    }
  }

  const membershipSaveResult = await saveMembershipsToFirestore(
    db,
    memberships
  );

  const missingFields = [];
  if (!title) missingFields.push("title");
  if (!FirstName) missingFields.push("FirstName");
  if (!LastName) missingFields.push("LastName");
  if (!Phone) missingFields.push("Phone");
  if (!email) missingFields.push("email");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  const generatedOTP = Math.floor(100000 + Math.random() * 900000);

  try {
    await client.messages.create({
      body: `Your OTP is: ${generatedOTP}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: Phone,
    });

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("Phone", "==", Phone).limit(1).get();

    if (!snapshot.empty) {
      // Update existing user
      const userDoc = snapshot.docs[0];
      await userDoc.ref.update({
        title,
        FirstName,
        LastName,
        email,
        otp: generatedOTP,
        otpCreatedAt: new Date().toISOString(),
      });
    } else {
      // Create new user
      await usersRef.add({
        title,
        FirstName,
        LastName,
        Phone,
        email,
        otp: generatedOTP,
        otpCreatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
    }

    res.status(200).json({ message: "OTP sent and data saved", phone: Phone });
  } catch (error) {
    console.error("Error in step-one:", error);
    res.status(500).json({
      message: "Failed to send OTP or save data",
      error: error.message,
    });
  }
});

userRouter.get("/userData/:phone", async (req, res) => {
  const { phone } = req.params;

  console.log(`Requested Phone Number: ${phone}`);

  if (!phone) {
    return res.status(400).json({
      message: "Missing required field: phone",
    });
  }

  try {
    // 2. Query Firestore for documents where Phone === phone
    const snapshot = await db
      .collection("users")
      .where("Phone", "==", phone)
      .get();

    if (snapshot.empty) {
      console.log("No Firestore entry found for this phone");
      return res.status(404).json({ message: "User data not found" });
    }

    // If multiple entries found, return all — or just the first
    const users = [];
    snapshot.forEach((doc) => {
      users.push(doc.data());
    });

    // Save to tempUsers for future quick access
    tempUsers[phone] = { userData: users[0] };

    console.log("Returning from Firestore:", users[0]);
    return res.status(200).json({ userData: users[0] }); // You can return all if needed
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

userRouter.post(
  "/step-two",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "documentFile", maxCount: 1 },
  ]),
  async (req, res) => {
    const {
      title,
      FirstName,
      LastName,
      Phone,
      email,
      DOB,
      Gender,
      address,
      city,
      state,
      pin,
      country,
      documentType,
      documentNumber,
    } = req.body;

    const profileImage = req.files?.profileImage?.[0] || null;
    const signature = req.files?.signature?.[0] || null;
    const documentFile = req.files?.documentFile?.[0] || null;

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const missingFields = [];
    ["title", "FirstName", "LastName", "Phone", "email"].forEach((field) => {
      if (!req.body[field]) missingFields.push(field);
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const phoneRegex = /^\+?[1-9][0-9 ]{7,19}$/;

    if (!phoneRegex.test(Phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Firestore update
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef
      .where("Phone", "==", Phone)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      return res
        .status(404)
        .json({ message: "User document not found in Firestore" });
    }

    try {
      // Save updated data to Firestore
      const usersRef = db.collection("users");
      const querySnapshot = await db
        .collection("users")
        .where("Phone", "==", Phone)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return res
          .status(404)
          .json({ message: "User document not found in Firestore" });
      }

      const userDoc = querySnapshot.docs[0];
      const docRef = usersRef.doc(userDoc.id);

      // 4. Update Firestore document
      await docRef.update({
        DOB,
        Gender,
        address,
        city,
        state,
        pin,
        country,
        documentType,
        documentNumber,
        profileImage: profileImage
          ? profileImage.buffer.toString("base64")
          : null,
        signature: signature ? signature.buffer.toString("base64") : null,
        documentFile: documentFile.buffer.toString("base64"),
        updatedAt: new Date().toISOString(),
      });

      console.log("Firestore updated with step-two data");

      return res.status(200).json({
        message: "Step two completed successfully",
      });
    } catch (error) {
      console.error("Step Two Error:", error);
      res
        .status(500)
        .json({ message: "Something went wrong", error: error.message });
    }
  }
);

userRouter.post(
  "/step-three",
  upload.any(), // accept all files
  async (req, res) => {
    try {
      const {
        Phone,
        education: educationStr,
        experience: experienceStr,
      } = req.body;

      if (!Phone) {
        return res
          .status(400)
          .json({ message: "Missing required field: Phone" });
      }

      if (!educationStr || !experienceStr) {
        return res
          .status(400)
          .json({ message: "Missing education or experience data" });
      }

      // Parse JSON strings
      let education, experience;
      try {
        education = JSON.parse(educationStr);
        experience = JSON.parse(experienceStr);
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Invalid JSON format for education or experience" });
      }

      if (!Array.isArray(education) || !Array.isArray(experience)) {
        return res
          .status(400)
          .json({ message: "Education and Experience must be arrays" });
      }

      // Validate required fields in education and experience
      const isValidEdu = education.every(
        (edu) => edu.degree && edu.institution && edu.year
      );
      const isValidExp = experience.every(
        (exp) => exp.role && exp.company && exp.duration
      );

      if (!isValidEdu || !isValidExp) {
        return res
          .status(400)
          .json({ message: "Some education or experience fields are missing" });
      }

      // Map files by fieldname for quick access
      // Expect files named document_edu_0, document_exp_1, etc.
      const filesMap = {};
      req.files.forEach((file) => {
        filesMap[file.fieldname] = file;
      });

      // Attach base64 encoded file content to each education and experience item if present
      education = education.map((edu, idx) => {
        const file = filesMap[`document_edu_${idx}`];
        if (file) {
          edu.document = {
            data: file.buffer.toString("base64"),
            mimeType: file.mimetype,
            originalName: file.originalname,
          };
        } else {
          edu.document = null;
        }
        return edu;
      });

      experience = experience.map((exp, idx) => {
        const file = filesMap[`document_exp_${idx}`];
        if (file) {
          exp.document = {
            data: file.buffer.toString("base64"),
            mimeType: file.mimetype,
            originalName: file.originalname,
          };
        } else {
          exp.document = null;
        }
        return exp;
      });

      // Find user doc in Firestore
      const usersRef = db.collection("users");
      const querySnapshot = await usersRef
        .where("Phone", "==", Phone)
        .limit(1)
        .get();

      if (querySnapshot.empty) {
        return res
          .status(404)
          .json({ message: "User document not found in Firestore" });
      }

      const userDoc = querySnapshot.docs[0];
      const docRef = usersRef.doc(userDoc.id);

      // Update Firestore document
      await docRef.update({
        education,
        experience,
        updatedAt: new Date().toISOString(),
      });

      return res
        .status(200)
        .json({ message: "Step three completed successfully" });
    } catch (error) {
      console.error("Step Three Error:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
);
userRouter.post("/verify_otp", async (req, res) => {
  const { Phone, otp } = req.body;

  if (!Phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP are required" });
  }

  try {
    const snapshot = await db
      .collection("users")
      .where("Phone", "==", Phone)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.otp != otp) {
      return res.status(400).json({ message: "Incorrect OTP" });
    }

    // Optional: Check OTP expiration (if you store `otpCreatedAt`)

    // Mark user as verified and remove OTP
    await userDoc.ref.update({
      verified: true,
      verifiedAt: new Date().toISOString(),
      otp: null,
      otpCreatedAt: null,
    });

    res.status(200).json({
      message: "OTP verified successfully",
      user: { ...userData, verified: true },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

userRouter.get("/user-details/:phone", async (req, res) => {
  let { phone } = req.params;

  // Decode URI-encoded characters (e.g. %2B → +)
  phone = decodeURIComponent(phone);

  if (!phone) {
    return res.status(400).json({
      message: "Missing required field: phone",
    });
  }

  try {
    const snapshot = await db
      .collection("users")
      .where("Phone", "==", phone)
      .get();

    if (snapshot.empty) {
      console.log("No Firestore entry found for this phone");
      return res.status(404).json({ message: "User data not found" });
    }

    const users = [];
    snapshot.forEach((doc) => {
      users.push(doc.data());
    });

    tempUsers[phone] = { userData: users[0] };

    console.log("Returning from Firestore:", users[0]);
    return res.status(200).json({ userData: users[0] });
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

userRouter.get("/subscription/:id", async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400).json({ message: "Subscription ID is required" });

  try {
    const docRef = db.collection("subscriptions").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.status(200).json({ subscription: doc.data() });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// GET /api/v1/subscriptions
userRouter.get("/subscriptions", async (req, res) => {
  try {
    const snapshot = await db.collection("subscriptions").get();

    const subscriptions = snapshot.docs.map((doc) => doc.data());
    return res.status(200).json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = { userRouter: userRouter };
