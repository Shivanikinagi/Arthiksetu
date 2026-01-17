# How to Run ArthikSetu on Android

I have successfully converted your React Web App into an Android Project using **Capacitor**.

## Prerequisites
- **Android Studio** must be installed on your machine.
- An Android device (USB Debugging enabled) OR an Android Emulator.

## Steps to Run

1. **Open in Android Studio:**
   Run the following command in your terminal (inside `Frontend` folder):
   ```bash
   npx cap open android
   ```
   *This will launch Android Studio with your project pre-loaded.*

2. **Run the App:**
   - In Android Studio, wait for Gradle sync to finish.
   - Click the green **"Play"** button at the top.
   - Select your connected phone or emulator.

## How to Update the App
If you make changes to your React code (Frontend), follow these steps to update the Android app:

1. **Re-build the Web App:**
   ```bash
   npm run build
   ```

2. **Sync to Android:**
   ```bash
   npx cap sync android
   ```

3. **Run on Device:**
   Run from Android Studio again.
