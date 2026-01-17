# React Native Migration Guide for Arthiksetu

You have successfully initialized a **React Native** project alongside your existing web frontend.

## 📁 Project Structure
- **Frontend/**: Your existing Web + Capacitor app (Keep this as a backup/reference).
- **Mobile/**: Your **NEW** React Native (Expo) app (The rewrite).

## 🚀 How to Run the New App

1. Open a new terminal.
2. Navigate to the mobile folder:
   ```bash
   cd Mobile
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the app:
   ```bash
   npx expo start
   ```
   - Press `a` to open in Android Emulator.
   - Press `w` to open in Web Browser (for quick preview).
   - Scan the QR code with your phone (using Expo Go app) to run on your physical device.

## 🔄 Migration Status

### Completed
- [x] **Project Setup**: Initialized `Mobile` directory with `package.json` for Expo.
- [x] **Dashboard UI**: Converted the main Dashboard screen to React Native (`App.tsx`).
    - Replaced `div` with `View`.
    - Replaced `span`/`p` with `Text`.
    - Replaced CSS classes with `StyleSheet`.
    - Implemented `SafeAreaView` for notch support.
    - Implemented `ScrollView` for content scrolling.
    - Added "Add Proof" bar and "Quick Actions" grid matching your design.

### Next Steps (To Do)
1.  **Navigation**: Install `react-navigation` to handle multiple screens (Tax, Schemes, etc.).
2.  **API Integration**: Connect `fetch` calls to your existing Django backend (`http://10.0.2.2:8000` for Android Emulator).
3.  **Authentication**: Port the Login/Signup screens.

This new project is a **true native app** foundation. You can now build upon it using React Native primitives.
