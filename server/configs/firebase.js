const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");
const admin = require("firebase-admin");

// var serviceAccount = require("../serviceAccountKey.json");

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

// main

// const serviceAccount = {
//   type: "service_account",
//   project_id: "bda-org-1148c",
//   private_key_id: "37efd4eb29daaf7fc6caf1c2a1d36858b842d7fd",
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/UkbPPAYF3HJI\no+etyuJMckjlmR1pKIg71Fe6DWJoxLqxd4fO0D0nKFawBCSIfdTiF88wVuiuxuyN\n88LLe65hGoca+ybPUpCKVVpTIqeQwKtdT66z2uyiLZlpO0Kj3TL4XVkqnUWsAiMz\nEzfdrgDDnKTmFRnIVTgEarNvZ6xTZfjsQ+J0vfErwvPX9Lgu2AecW2aXyawaTqgd\nPGYcqaCQ+ny6WwsKLX/cY8FhYqV6J+aac0o5y9BVwsxajxrWm8rf8tVOFSkyRaaG\nDw0zLk/Dqzb0X8Cb1aSVTHTjh/q5QDx5C6+dEewB2yDBMR5vYTQc/r5HUywAt5b7\nFWGSxOHlAgMBAAECggEAERpHRy478ZkvxCuWwdPxn9jViGTEGsrrRsHoJ7MbmXcA\no22mf8fgt5flC+4K4AKznZR4Sn9yZHFW4yenwa3oPDj1W+WYpg7g6eTQYr8l0IxQ\npVJCsURARA0keiI4hlJ3RHl/x43wlPxJ7j5pD5GG8vWVThYTzHNFwytQqARSBNBg\nt7AFTLmREl3dDOPzTkTnCfEtF8c3yrWmZ2vMsgiyI0Orhi+8buxbbPq8yLyYr2TE\nI/OPtASniWB0zHzmAdzPt/3e/LaBxCSmAQUalh7z2LTGw/pwTYvLNjSSmf8p+KUH\nqjGP68myOxgqd8Nj6Kor0wjORU3FNeWGhkEt1zljrwKBgQDjYMrHCqNO+n6Wyr60\nfPbmsC3/mxnKdYhhWcY04itNRyYhPirYWnt3JVlU91ytD6JV0uD0O8Rzm6lUTTTj\nzIeOgaOAAg//Ce5cjmhEK1I1V4krF9at8dTiNn6cfx2r+OSsopRizTKs0tBzXG1o\nuRNmZF/YksPkW1ojMWlyAaO/5wKBgQDXZ5C/cWhFQF4EccexOoiE4v3WHGtiDQ92\n2WOHTCFJWVm1ZfqN8OED3ythqnAuCHINooHxVRRs3yevSbCJ/LGbkkMOIeV2mWlD\njvLFIb+oYzw44VrlAEz6TYJpF6vgbKJAGjr+L3n0tgbfeUPBxShP16lv080niwb1\nCCZT1ZfGUwKBgGnlGEtevvP3YaFkxzBTysFhZ+rVF0vdNSjxoIfclYImErIEu/uL\nGFlDAbm6gmTvFRGXZsEYXMPiyRfD5U/6X1+VLMpfK4gB3gspH5IwAtdo7y8sqQTV\nzemUq57C7NS80/M6vJTPMDyg6gfwEdxl5Y0YTjMVFzpw+SfOyWcZMGQdAoGAIgwt\ntgT//UpCUiOF8/6Ti6Wxh8FwO8xisF+GOuGOtWBZLLIU25DCkHEbE1H0b2JIXN1d\n+r5+/wJ67FsSe40kqbmBvd8fvRJcsCANQZmnCL++yiLc0ius/zd3MJNcSJoDP2yl\n/H2WolaPWY16Z0t5pr0o/BMXb3OrQtnp7QBrAB8CgYAuua+9JCuwA5ZXzQGlAkwB\nT+4woI6EZhDU3bmczhgc327lMikCTHsqUZ4+nhJJ7rAdWbE5863Gk02SgyjIwz6l\n3/niczUfME7Cl4Y6PZJqPDsEXsR7RD0jmfZuw6Bwdug9+W9RFb0hWoobPC1v+1dS\nMjaaggTu4AxEY7xQGh4yiQ==\n-----END PRIVATE KEY-----\n",
//   client_email: "firebase-adminsdk-fbsvc@bda-org-1148c.iam.gserviceaccount.com",
//   client_id: "104663810027968814602",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url:
//     "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40bda-org-1148c.iam.gserviceaccount.com",
//   universe_domain: "googleapis.com",
// };

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const messaging = getMessaging(app);
module.exports = { db, messaging, admin };
