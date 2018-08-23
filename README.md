# React Native Expo Firebase Chat
Simple and Clean one-to-one messenger and chat rooms

This app is a one-to-one chat service using the Firebase Realtime Database for instant data. The chat rooms feature will be added in the future.

It was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app) and is running on Expo.

## How to run the app
### 1. Run the app locally using the Expo XDE app (My preferred way):
  - Install the Expo XDE app from https://docs.expo.io/versions/latest/introduction/installation
  - Open the Expo XDE app
  - Choose `Open existing project`
  - Choose the root folder location
  - This will spin up the packager
  - To view the app on a mobile device, open the Expo App on your mobile device and choose the project
  - To view the app in the simulator, click on `Device` in the Expo XDE app and choose `Open on iOS Simulator` or `Open on Android`.

### 2. Run the app from the command line:
  - Run `npm install -g exp` to install the Expo CLI globally
  - Navigate to the root folder location
  - To view the app on a mobile device:
      - Run `exp start` and open the Expo App on your mobile device and choose the project
  - To view the app in the simulator:
    - For iOS, run `exp ios`
    - For Android, run `exp android`

###  3. Use the `yarn start`, `yarn ios`, or `yarn android` tasks as detailed below.

  ## Available Scripts

  This app was initialized using Yarn and therefore you should use Yarn commands going forward.

Below you'll find information about performing common tasks.

* [Available Scripts](#available-scripts)
  * [yarn start](#npm-start)
  * [yarn test](#npm-test)
  * [yarn ios](#npm-run-ios)
  * [yarn android](#npm-run-android)
  * [yarn eject](#npm-run-eject)

  ### `yarn start`

  Runs your app in development mode.

  Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

  Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

  ```
  yarn start --reset-cache
  ```

  #### `yarn test`

  Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

  #### `yarn ios`

  Like `yarn start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

  #### `yarn android`

  Like `yarn start`, but also attempts to open your app on a connected Android device or emulator. Requires an installation of Android build tools (see [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for detailed setup). We also recommend installing Genymotion as your Android emulator. Once you've finished setting up the native build environment, there are two options for making the right copy of `adb` available to Create React Native App:

  ##### Using Android Studio's `adb`

  1. Make sure that you can run adb from your terminal.
  2. Open Genymotion and navigate to `Settings -> ADB`. Select “Use custom Android SDK tools” and update with your [Android SDK directory](https://stackoverflow.com/questions/25176594/android-sdk-location).

  ##### Using Genymotion's `adb`

  1. Find Genymotion’s copy of adb. On macOS for example, this is normally `/Applications/Genymotion.app/Contents/MacOS/tools/`.
  2. Add the Genymotion tools directory to your path (instructions for [Mac](http://osxdaily.com/2014/08/14/add-new-path-to-path-command-line/), [Linux](http://www.computerhope.com/issues/ch001647.htm), and [Windows](https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/)).
  3. Make sure that you can run adb from your terminal.

  #### `yarn eject`

  This will start the process of "ejecting" from Create React Native App's build scripts. You'll be asked a couple of questions about how you'd like to build your project.

  **Warning:** Running eject is a permanent action (aside from whatever version control system you use). An ejected app will require you to have an [Xcode and/or Android Studio environment](https://facebook.github.io/react-native/docs/getting-started.html) set up.
