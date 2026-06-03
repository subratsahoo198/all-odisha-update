# How to Build and Run Your Android App (.apk)

We have successfully configured **Ionic Capacitor** and added the native Android wrapper inside the `android/` directory.

Follow these simple steps to compile and generate your Android app:

---

## 1. Install Prerequisites
Make sure you have the following installed on your computer:
1. **Android Studio**: [Download & Install Android Studio](https://developer.android.com/studio)
2. **Java JDK 17 (or newer)**: Typically installed automatically with Android Studio.

---

## 2. Open the Project in Android Studio
1. Open **Android Studio**.
2. Click **Open** (or **Open an Existing Project**).
3. Navigate to your project folder: `/Users/subrat123/AI SONG/all-odisha-update` and select the **`android`** folder inside it.
4. Click **Open**. Android Studio will import the project and start sync'ing the Gradle files (this may take a few minutes for the first setup).

---

## 3. How to Build the APK
Once Android Studio completes the Gradle sync:
1. In the top menu, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. Android Studio will compile your app. Once finished, a notification popup will appear at the bottom right.
3. Click **locate** in that popup to open the folder containing your brand new **`app-debug.apk`**!
4. You can transfer this `.apk` file to any Android phone to install and run your app.

---

## 4. Run on an Emulator or Real Phone
* **On Emulator**: Click the **Run** button (green play icon `▶`) in the top toolbar to launch the app inside a virtual Android device.
* **On Real Phone**: Connect your Android phone via USB, enable **Developer Options** and **USB Debugging**, select your phone in the top device dropdown in Android Studio, and click **Run**.

---

## Development & Re-syncing Code
If you modify any HTML, CSS, or JavaScript files in the future inside the `public/` folder, sync them to Android by running:
```bash
npx cap sync android
```
Then rebuild the APK in Android Studio!
