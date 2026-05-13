# Holy Bible: Sacred Edition - Play Store Publication Guide

This guide provides everything you need to register, prepare, and publish your Bible app to the Google Play Store.

---

## 1. Google Play Developer Registration
Before you can upload, you must create a developer account.

*   **URL**: [https://play.google.com/console/signup](https://play.google.com/console/signup)
*   **Account Type**: Choose "Personal" (unless you have a registered company).
*   **The Fee**: **$25 USD** (approx. ₹2,100). This is a one-time fee for life.
*   **Requirements**: 
    *   A valid Google Account.
    *   A Credit/Debit card with **International Transactions** enabled.
    *   A Government ID (Passport, PAN Card, or Aadhaar) for identity verification.

---

## 2. Store Listing Details
Copy and paste these directly into the Google Play Console.

### **App Name**
`Holy Bible: Sacred Edition`

### **Short Description**
`Read, listen, and explore the Holy Bible in Telugu and English with AI spiritual guidance.`

### **Full Description**
```text
Experience the Word of God like never before with the Holy Bible: Sacred Edition. Designed for a premium, distraction-free reading experience, our app brings the scriptures to life in both Telugu and English.

KEY FEATURES:
- DUAL LANGUAGE MODE: Read Telugu and English verses side-by-side for deeper study.
- SACRED AUDIO: Listen to the Bible with high-quality, natural-sounding audio in both languages.
- HOLY AI COMPANION: Ask questions and receive spiritual guidance and commentaries powered by advanced AI.
- SACRED LINKS: Discover over 30+ thematic cross-references for every verse to see the Bible's hidden connections.
- PREMIUM UI: A stunning, modern interface with Light and Dark modes designed for sacred reading.
- DAILY BREAD: Receive a fresh, AI-powered devotional and prayer every single day.
- CUSTOM WALLPAPERS: Create and download beautiful Bible verse wallpapers to share your faith.

Whether you are a lifelong believer or just beginning your journey, the Sacred Edition is built to help you grow closer to the Divine. No ads, no distractions—just the pure Word of God.
```

---

## 3. Visual Assets (Graphic Requirements)
You will need to prepare these images:

1.  **App Icon**: 512 x 512 pixels (PNG/WEBP).
2.  **Feature Graphic**: 1024 x 500 pixels (PNG/WEBP). This is the big banner on your store page.
3.  **Screenshots**: 
    *   At least 4 screenshots for Phones.
    *   At least 4 screenshots for Tablets (7-inch and 10-inch).
    *   *Tip: Use the emulator to take these screenshots of the Home Screen, Reading Screen (Dual Mode), and Holy AI Chat.*

---

## 4. Technical Build (Generating the .AAB)
Google Play requires an **Android App Bundle (.aab)**. We use Expo Application Services (EAS) to create this.

### **Step 1: Install EAS CLI**
Run this in your terminal:
`npm install -g eas-cli`

### **Step 2: Log in to Expo**
`eas login`

### **Step 3: Configure the Project**
`eas build:configure`

### **Step 4: Run the Production Build**
`eas build -p android --profile production`

*Once this command finishes, it will provide a link to download your `sacred-bible.aab` file.*

---

## 5. Final Submission Steps
1.  Go to **Production** -> **Create New Release**.
2.  Upload the `.aab` file you generated.
3.  Fill out the **Content Rating** and **App Content** questionnaires (Privacy Policy, Ads, etc.).
4.  **Privacy Policy URL**: Use the one we generated or host the `PRIVACY_POLICY.md` on a website/GitHub.
5.  Click **Review Release** and then **Start Rollout to Production**.

---

**CONGRATULATIONS!** Your app will be sent to Google for review (usually takes 2-4 days) and then it will be live for the world to download.
