# Expo Documentation

Expo is an open-source React Native framework for apps that run natively on Android, iOS, and the web. Expo brings together the best of mobile and the web and enables many important features for building and scaling an app such as live updates, instantly sharing your app, and web support. The company behind Expo also offers Expo Application Services (EAS), which are deeply integrated cloud services for Expo and React Native apps.

# Get started

## Introduction

Get started creating apps with Expo.

Expo is a framework that makes developing Android and iOS apps easier. Our framework provides file-based routing, a standard library of native modules, and much more. Expo is open source with an active community on [GitHub](https://github.com/expo/expo) and [Discord](https://chat.expo.dev).
We also make [Expo Application Services (EAS)](https://expo.dev/eas), a set of services that complement the Expo framework in each step of the development process.
To get started visit:


## Create a project

Learn how to create a new Expo project.

System requirements:
- [Node.js (LTS)](https://nodejs.org/en/).
- macOS, Windows (Powershell and [WSL 2](https://expo.fyi/wsl)), and Linux are supported.
We recommend starting with the default project created by `create-expo-app`. The default project includes example code to help you get started.
To create a new project, run the following command:
```sh
$ npx create-expo-app@latest
```
> You can choose a different template by adding the [`--template` option](/more/create-expo/#--template).
## Next step
You have a project. Now it's time to set up your development environment so that you can start developing.


## Set up your environment

Learn how to set up your development environment to start building with Expo.

Let's set up a local development environment for running your project on Android and iOS.
## Where would you like to develop?
We recommend using a real device to develop, since you'll get to see exactly what your users will see.
## How would you like to develop?
Expo Go is a sandbox for trying out Expo quickly. A development build is a build of your own app that includes Expo's developer tools.
---
# Android Emulator Setup

## Set up an emulator
Step 1: 
On the Android Studio main screen, click **More Actions**, then **Virtual Device Manager** in the dropdown.
Step 2: 
Click the **Create device** button.
Step 3: 
Under **Add device**, choose the type of hardware you'd like to emulate. We recommend testing against a variety of devices, but if you're unsure where to start, the newest device in the Pixel line could be a good choice.
Step 4: 
Select an OS version to load on the emulator (probably one of the system images), and download the image (if required).
Step 5: 
Change any other settings you'd like, and press **Finish** to create the emulator. You can now run this emulator anytime by pressing the Play button in the AVD Manager window.

# Android Studio Environment Setup

## Install Watchman and JDK
<Tab label='macOS'>
#### Prerequisites
Use a package manager such as [Homebrew](https://brew.sh/) to install the following dependency.
#### Install dependencies
Step 1: 
[Install Watchman](https://facebook.github.io/watchman/docs/install#macos) using a tool such as Homebrew:
```sh
$ brew install watchman
```
Step 2: 
Install OpenJDK distribution called Azul Zulu using Homebrew. This distribution offers JDKs for both Apple Silicon and Intel Macs.
Run the following commands in a terminal:
```sh
$ brew install --cask zulu@17
```
After you install the JDK, add the `JAVA_HOME` environment variable in **~/.bash_profile** (or **~/.zshrc** if you use Zsh):
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
```
<Tab label='Windows'>
#### Prerequisites
Use a package manager such as [Chocolatey](https://chocolatey.org/) to install the following dependencies.
#### Install dependencies
Install [Java SE Development Kit (JDK)](https://openjdk.org/):
```sh
$ choco install -y microsoft-openjdk17
```
For Linux: 
#### Install dependencies
Step 1: 
Follow [instructions from the Watchman documentation](https://facebook.github.io/watchman/docs/install#linux) to compile and install it from the source.
Step 2: 
Install [Java SE Development Kit (JDK)](https://openjdk.org/):
You can download and install [OpenJDK@17](http://openjdk.java.net/) from [AdoptOpenJDK](https://adoptopenjdk.net/) or your system packager.


# Android Studio Setup

## Set up Android Studio
For macOS: 
Step 1: 
Download and install [Android Studio](https://developer.android.com/studio).
Step 2: 
Open the **Android Studio** app, you will see the **SDK Components setup** screen. Click **Next** to continue to install the Android SDK and Android SDK Platform. Click **Next** again to verify the settings and install.
Step 3: 
By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.
Open Android Studio, go to **Settings** &gt; **Languages & Frameworks** &gt; **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.
Step 4: 
Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.
Step 5: 
Copy or remember the path listed in the box that says **Android SDK Location**.
Step 6: 
Add the following lines to your **/.zprofile** or **~/.zshrc** (if you are using bash, then **~/.bash_profile** or **~/.bashrc**) config file:
```sh
$ export ANDROID_HOME=$HOME/Library/Android/sdk
$ export PATH=$PATH:$ANDROID_HOME/emulator
$ export PATH=$PATH:$ANDROID_HOME/platform-tools
```
Step 7: 
Reload the path environment variables in your current shell:
```sh
$ source $HOME/.zshrc
$ source $HOME/.bashrc
```
Step 8: 
Finally, make sure that you can run `adb` from your terminal.
Note: Troubleshooting: Android Studio not recognizing JDK
---
If Android Studio doesn't recognize your homebrew installed JDK, you can create a Gradle configuration file to explicitly set the Java path:
1.  Create a Gradle properties file in your home directory:
    ```sh
$ touch ~/.gradle/gradle.properties
```
2.  Add the following line to the **gradle.properties** file, replacing the path with your actual Java installation path:
    ```bash gradle.properties
    java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
    ```
3.  If you have an existing `.gradle` folder in your project directory, delete it and reopen your project in Android Studio:
    ```sh
$ rm -rf .gradle
```
This should resolve issues with Android Studio not detecting your JDK installation.
---
For Windows: 
Step 1: 
Download [Android Studio](https://developer.android.com/studio).
Step 2: 
Open **Android Studio Setup**. Under **Select components to install**, select Android Studio and Android Virtual Device. Then, click **Next**.
Step 3: 
In the Android Studio Setup Wizard, under **Install Type**, select **Standard** and click **Next**.
Step 4: 
The Android Studio Setup Wizard will ask you to verify the settings, such as the version of Android SDK, platform-tools, and so on. Click **Next** after you have verified.
Step 5: 
In the next window, accept licenses for all available components.
Step 6: 
By default, Android Studio will install the latest version of the Android SDK. However, Android 15 (`VanillaIceCream`) SDK is required to compile a React Native app.
Open Android Studio, go to **Settings** &gt; **Languages & Frameworks** &gt; **Android SDK**. From the **SDK Platforms** tab, and under **Android 15 (`VanillaIceCream`)**, select **Android SDK Platform 35** and **Sources for Android 35**.
Step 7: 
Then, click on the **SDK Tools** tab and make sure you have at least one version of the **Android SDK Build-Tools** and **Android Emulator** installed.
Step 8: 
After the tools installation is complete, configure the `ANDROID_HOME` environment variable. Go to **Windows Control Panel** &gt; **User Accounts** &gt; **User Accounts** (again) &gt; **Change my environment variables** and click **New** to create a new `ANDROID_HOME` user variable. The value of this variable will point to the path to your Android SDK:
Note: How to find installed SDK location?
---
By default, the Android SDK is installed at the following location:
```bash
%LOCALAPPDATA%\Android\Sdk
```
To find the location of the SDK in Android Studio manually, go to **Settings** &gt; **Languages & Frameworks** &gt; **Android SDK**. See the location next to **Android SDK Location**.
---
Step 9: 
To verify that the new environment variable is loaded, open **PowerShell**, and copy and paste the following command:
```sh
$ Get-ChildItem -Path Env: 
```
The command will output all user environment variables. In this list, see if `ANDROID_HOME` has been added.
Step 10: 
To add platform-tools to the Path, go to **Windows Control Panel** &gt; **User Accounts** &gt; **User Accounts** (again) &gt; **Change my environment variables** &gt; **Path** &gt; **Edit** &gt; **New** and add the path to the platform-tools to the list as shown below:
Note: How to find installed platform-tools location
---
By default, the platform-tools are installed at the following location:
```bash
%LOCALAPPDATA%\Android\Sdk\platform-tools
```
---
Step 11: 
Finally, make sure that you can run `adb` from the PowerShell. For example, run the `adb --version` to see which version of the `adb` your system is running.


# Xcode Setup

Step 1: 
### Install Xcode
Open up the Mac App Store, search for [Xcode](https://apps.apple.com/us/app/xcode/id497799835), and click **Install** (or **Update** if you have it already).
Step 2: 
### Install Xcode Command Line Tools
Open Xcode, choose **Settings...** from the Xcode menu (or press <kbd>cmd âŒ˜</kbd> + <kbd>,</kbd>). Go to the **Locations** and install the tools by selecting the most recent version in the **Command Line Tools** dropdown.
Step 3: 
### Install an iOS Simulator in Xcode
To install an iOS Simulator, open **Xcode &gt; Settings... &gt; Components**, and under **Platform Support &gt; iOS ...**, click **Get**.
Step 4: 
### Install Watchman
[Watchman](https://facebook.github.io/watchman/docs/install#macos) is a tool for watching changes in the filesystem. Installing it will result in better performance. You can install it with:
```sh
$ brew update
$ brew install watchman
```


# Create a development build for a physical Android device with EAS

## Set up an Android device with a development build
<BuildEnvironmentSwitch />
Step 1: 
### Install EAS CLI
To build your app, you will need to install EAS CLI. You can do this by running the following command in your terminal:
```sh
$ npm install -g eas-cli
```
Step 2: 
### Create an Expo account and login
To build your app, you will need to create an Expo account and login to the EAS CLI.
1. [Sign up](https://expo.dev/signup) for an Expo account.
2. Run the following command in your terminal to log in to the EAS CLI:
   ```sh
$ eas login
```
Step 3: 
### Configure your project
Run the following command to create an EAS config in your project:
```sh
$ eas build:configure
```
Step 4: 
### Create a build
Run the following command to create a development build:
```sh
$ eas build --platform android --profile development
```
Step 5: 
### Install the development build on your device
After the build is complete, scan the QR code in your terminal or open the link on your device. Tap **Install** to download the build on your device, then tap **Open** to install it.


# Create a development build for a physical Android device locally

## Set up an Android device with a development build
<BuildEnvironmentSwitch />
<AndroidStudioEnvironmentInstructions />
<AndroidStudioInstructions />
## Running your app on an Android device
Step 1: 
### Install expo-dev-client
Run the following command in your project's root directory:
```sh
$ npx expo install expo-dev-client
```
Step 2: 
### Enable debugging over USB
Most Android devices can only install and run apps downloaded from Google Play, by default. You will need to enable USB Debugging on your device to install your app during development.
To enable USB debugging on your device, you will first need to enable the "Developer options" menu by going to **Settings** &gt; **About phone** &gt; **Software information** and then tapping the `Build number` row at the bottom seven times. You can then go back to **Settings** &gt; **Developer options** to enable "USB debugging".
Step 3: 
### Plug in your device via USB
Plug in your Android device via USB to your computer.
Check that your device is properly connecting to ADB, the Android Debug Bridge, by running `adb devices` in your terminal. You should see your device listed with `device` listed next to it. For example:
```sh
$ adb devices
List of devices attached
8AHX0T32K	device
```
Step 4: 
### Run your app
Run the following from your terminal:
```sh
$ npx expo run:android
```
> This command runs a development server after building your app. You can skip running `npx expo start` on the next page.


# Run on a physical Android device with Expo Go

## Set up an Android device with Expo Go
Scan the QR code to download the app from the Google Play Store, or visit the Expo Go page on the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs).
<div className="inline-block rounded-lg border border-default bg-palette-white p-4">
  <QRCodeReact
    value="https://play.google.com/store/apps/details?id=host.exp.exponent&referrer=docs"
    size={228}
  />
</div>


# Create a development build for Android Emulator with EAS

## Set up an Android Emulator with a development build
<BuildEnvironmentSwitch />
<AndroidStudioInstructions />
<AndroidEmulatorInstructions />
## Create a development build
Step 1: 
### Install EAS CLI
To build your app, you will need to install EAS CLI. You can do this by running the following command in your terminal:
```sh
$ npm install -g eas-cli
```
Step 2: 
### Create an Expo account and login
To build your app, you will need to create an Expo account and login to the EAS CLI.
1. [Sign up](https://expo.dev/signup) for an Expo account.
2. Run the following command in your terminal to log in to the EAS CLI:
   ```sh
$ eas login
```
Step 3: 
### Configure your project
Run the following command to create an EAS config in your project:
```sh
$ eas build:configure
```
Step 4: 
### Create a build
Run the following command to create a development build:
```sh
$ eas build --platform android --profile development
```
Step 5: 
### Install the development build on your emulator
After the build is complete, the CLI will prompt you to automatically download and install it on the Android Emulator. When prompted, press <kbd>Y</kbd> to directly install it on the emulator.
If you miss this prompt, you can download the build from the link provided in the terminal and drag and drop it onto the Android Emulator to install it.


# Create a development build for Android Emulator locally

## Set up an Android Emulator with a development build
<BuildEnvironmentSwitch />
<AndroidStudioEnvironmentInstructions />
<AndroidStudioInstructions />
<AndroidEmulatorInstructions />
## Running your app on an Android Emulator
Step 1: 
### Install expo-dev-client
Run the following command in your project's root directory:
```sh
$ npx expo install expo-dev-client
```
Step 2: 
Run the following from your terminal:
```sh
$ npx expo run:android
```
> This command runs a development server after building your app. You can skip running `npx expo start` on the next page.


# Run on Android Emulator with Expo Go

## Set up an Android Emulator with Expo Go
<AndroidStudioInstructions />
<AndroidEmulatorInstructions />
## Install Expo Go
When you start a development server with `npx expo start` on the [start developing](/get-started/start-developing) page, press <kbd>a</kbd> to open the Android Emulator. Expo CLI will install Expo Go automatically.


# Create a development build for a physical iOS device with EAS

## Set up an iOS device with a development build
<BuildEnvironmentSwitch />
Step 1: 
### Enroll in the Apple Developer Program
To install a development build on your iOS device, you will need an active subscription to the Apple Developer Program. Sign up for the [Apple Developer Program here](https://developer.apple.com/programs/).
Step 2: 
### Install EAS CLI
To build your app, you will need to install EAS CLI. You can do this by running the following command in your terminal:
```sh
$ npm install -g eas-cli
```
Step 3: 
### Create an Expo account and login
Next, you will need to create an Expo account and login to the EAS CLI.
1. [Sign up](https://expo.dev/signup) for an Expo account.
2. Run the following command in your terminal to log in to the EAS CLI:
   ```sh
$ eas login
```
Step 4: 
### Configure your project
Run the following command to create an EAS config in your project:
```sh
$ eas build:configure
```
Step 5: 
### Create an ad hoc provisioning profile
To install a development build on your iOS device, you will need to create an ad hoc provisioning profile. Create one by running the following command in your terminal:
```sh
$ eas device:create
```
Step 6: 
### Create a development build
Run the following command to create a development build:
```sh
$ eas build --platform ios --profile development
```
Step 7: 
### Install the development build on your device
After the build is complete, scan the QR code in your terminal and tap **Open with iTunes** when it appears inside the Camera app. Alternatively, open the link displayed in the terminal on your device.
After confirming the installation, the app will appear in your device's app library.
Step 8: 
### Turn on developer mode
1. Open **Settings** &gt; **Privacy & Security**, scroll down to the **Developer Mode** list item and navigate into it.
2. Tap the switch to enable **Developer Mode**. After you do so, Settings presents an alert to warn you that Developer Mode reduces your device's security. To continue enabling **Developer Mode**, tap the alert's **Restart** button.
3. After the device restarts and you unlock it, the device shows an alert confirming that you want to enable Developer Mode. Tap **Turn On**, and enter your device passcode when prompted.
> Alternatively, if you have Xcode installed on your Mac, you can use it to [enable iOS developer mode](/guides/ios-developer-mode/#connect-an-ios-device-with-a-mac).


# Create a development build for a physical iOS device locally

## Set up an iOS device with a development build
<BuildEnvironmentSwitch />
## Set up Xcode and Watchman
<XcodeInstructions />
## Configure your project
Step 1: 
### Install expo-dev-client
Run the following command in your project's root directory:
```sh
$ npx expo install expo-dev-client
```
Step 2: 
### Plug in your device via USB and enable developer mode
1. Connect your iOS device to your Mac using a USB cable. Unlock the device and tap **Trust** if prompted.
2. Open Xcode. From the menu bar, select **Window** &gt; **Devices and Simulators**. You will see a warning in Xcode to enable developer mode.
3. On your iOS device, open **Settings** &gt; **Privacy & Security**, scroll down to the **Developer Mode** list item and navigate into it.
4. Tap the switch to enable **Developer Mode**. After you do so, Settings presents an alert to warn you that Developer Mode reduces your device's security. To continue enabling **Developer Mode**, tap the alert's **Restart** button.
5. After the device restarts and you unlock it, the device shows an alert confirming that you want to enable Developer Mode. Tap **Turn On**, and enter your device passcode when prompted.
Step 3: 
### Run the project on your device
1. Add the `ios.bundleIdentifier` in the **app.json** file in the root directory to a unique value so that Xcode generates the provisioning profile for the app signing step.
2. Run the following command in your project's root directory and select your plugged in device from the list:
```sh
$ npx expo run:ios --device
```
> This command runs a development server after building your app. You can skip running `npx expo start` on the next page.


# Run on a physical iOS device with Expo Go

## Set up an iOS device with Expo Go
Scan the QR code to download the app from the App Store, or visit the Expo Go page on the [App Store](https://itunes.apple.com/app/apple-store/id982107779).
<div className="inline-block rounded-lg border border-default bg-palette-white p-4">
  <QRCodeReact value="https://itunes.apple.com/app/apple-store/id982107779" size={228} />
</div>


# Create a development build for iOS Simulator with EAS

## Set up an iOS Simulator with a development build
<BuildEnvironmentSwitch />
## Set up Xcode
<XcodeInstructions />
## Create a development build
Step 1: 
### Install EAS CLI
To build your app, you will need to install EAS CLI. You can do this by running the following command in your terminal:
```sh
$ npm install -g eas-cli
```
Step 2: 
### Create an Expo account and login
Next, you will need to create an Expo account and login to the EAS CLI.
1. [Sign up](https://expo.dev/signup) for an Expo account.
2. Run the following command in your terminal to log in to the EAS CLI:
   ```sh
$ eas login
```
Step 3: 
### Configure your project
Run the following command to create an EAS config in your project:
```sh
$ eas build:configure
```
Step 4: 
### Adjust your build profile
To create a simulator-compatible development build, you'll need to update your build profile in **eas.json** to set the `ios.simulator` property to `true`:
```json eas.json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
  }
}
```
Step 5: 
### Create a development build
Run the following command to create a development build:
```sh
$ eas build --platform ios --profile development
```
Step 6: 
### Install the development build on your simulator
After the build is complete, the CLI will prompt you to automatically download and install it on the iOS Simulator. When prompted, press <kbd>Y</kbd> to directly install it on the simulator.
If you miss this prompt, you can download the build from the link provided in the terminal and drag and drop it onto the iOS Simulator to install it.


# Create a development build for iOS Simulator locally

## Set up an iOS Simulator with a development build
<BuildEnvironmentSwitch />
## Set up Xcode and Watchman
<XcodeInstructions />
## Running your app on an iOS Simulator
Step 1: 
### Install expo-dev-client
Run the following command in your project's root directory:
```sh
$ npx expo install expo-dev-client
```
Step 2: 
Run the following from your terminal:
```sh
$ npx expo run:ios
```
> This command runs a development server after building your app. You can skip running `npx expo start` on the next page.


# Run on iOS Simulator with Expo Go

## Set up an iOS Simulator with Expo Go
## Set up Xcode
<XcodeInstructions />
## Install Expo Go
When you start a development server with `npx expo start` on the [start developing](/get-started/start-developing) page, press <kbd>i</kbd> to open the iOS Simulator. Expo CLI will install Expo Go automatically.



## Next step
You have a project and a development environment. Now it's time to start developing.


## Start developing

Make your first change to an Expo project and see it live on your device.

Step 1: 
## Start a development server
To start the development server, run the following command:
```sh
$ npx expo start
```
Step 2: 
## Open the app on your device
After running the command above, you will see a QR code in your terminal. Scan this QR code to open the app on your device.
If you're using an Android Emulator or iOS Simulator, you can press <kbd>a</kbd> or <kbd>i</kbd> respectively to open the app.
Note: Having problems?
---
Make sure you are on the same Wi-Fi network on your computer and your device.
If it still doesn't work, it may be due to the router configuration &mdash; this is common for public networks. You can work around this by choosing the **Tunnel** connection type when starting the development server, then scanning the QR code again.
```sh
$ npx expo start --tunnel
```
> Using the **Tunnel** connection type will make the app reloads considerably slower than on **LAN** or **Local**, so it's best to avoid tunnel when possible. You may want to install and use an emulator or simulator to speed up development if **Tunnel** is required to access your machine from another device on your network.
---
Step 3: 
## Make your first change
Open the **app/(tabs)/index.tsx** file in your code editor and make a change.
```diff
diff --git a/app/(tabs)/index.tsx b/app/(tabs)/index.tsx
index 45cfa0e..4d1b384 100644
--- a/app/(tabs)/index.tsx
+++ b/app/(tabs)/index.tsx
@@ -17,7 +17,7 @@ export default function HomeScreen() {
      }
    >
      <ThemedView style={styles.titleContainer}>
-       <ThemedText type="title">Welcome!</ThemedText>
+       <ThemedText type="title">Hello World!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
```
Note: Changes not showing up on your device?
---
Expo Go is configured by default to automatically reload the app whenever a file is changed, but let's make sure to go over the steps to enable it in case somehow things aren't working.
- Make sure you have the [development mode enabled in Expo CLI](/workflow/development-mode#development-mode).
- Close the Expo app and reopen it.
- Once the app is open again, shake your device to reveal the developer menu. If you are using an emulator, press <kbd>Ctrl</kbd> + <kbd>M</kbd> for Android or <kbd>Cmd âŒ˜</kbd> + <kbd>D</kbd> for iOS.
- If you see **Enable Fast Refresh**, press it. If you see **Disable Fast Refresh**, dismiss the developer menu. Now try making another change.
---
---
## File structure
Below, you can get familiar with the default project's file structure:
<ProjectStructure />
## Features
The default project template has the following features:
<TemplateFeatures />


## Next steps

Develop, review, and submit your project.

Here are next steps to continue building your app:
### Reset your project
You can remove the boilerplate code and start fresh with a new project. Run the following command to reset your project:
```sh
$ npm run reset-project
```
This command will move the existing files in **app** to **app-example**, then create a new **app** directory with a new **index.tsx** file.
### Develop, review, and deploy
Learn how to develop by reading the docs in the Develop section. You'll learn how to create [UI elements](/develop/user-interface/splash-screen-and-app-icon/), add [unit tests](/develop/unit-testing/), include [native modules](/config-plugins/introduction/), and more.
Once you've developed your app, you can share it with your teammates for [review](/review/overview).
Finally, you can [build](/deploy/build-project/) and [submit](/deploy/submit-to-app-stores/) your project to the app stores.
### Step-by-step guide
For a guided, step-by-step walkthrough of building an app with Expo from start to finish, check out the [tutorial](/tutorial/introduction/).


# Develop

## Tools for development

An overview of Expo tools and websites that will help you during various aspects of your project-building journey.

When you create a new project with Expo, learning about the following essential tools and websites can help you during your app development journey. This page provides an overview of a list of recommended tools.
## Expo CLI
Expo CLI is a development tool and is installed automatically with `expo` package when you create a new project. You can use it by leveraging `npx` (a Node.js package runner).
It is designed to help you move faster during the app development phase. For example, your first interaction with Expo CLI is starting the development server by running the command: `npx expo start`.
The following is a list of common commands that you will use with Expo CLI while developing your app:
| Command                         | Description                                                                                                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `npx expo start`                | Starts the development server (whether you are using a development build or Expo Go).                                                                            |
| `npx expo prebuild`             | Generates native Android and iOS directories using [Prebuild](/workflow/prebuild/).                                                                              |
| `npx expo run:android`          | Compiles native Android app locally.                                                                                                                             |
| `npx expo run:ios`              | Compiles native iOS app locally.                                                                                                                                 |
| `npx expo install package-name` | Used to install a new library or validate and update specific libraries in your project by adding `--fix` option to this command.                                |
| `npx expo lint`                 | [Setup and configures](/guides/using-eslint/) ESLint. If ESLint is already configured, this command will [lint your project files](/guides/using-eslint/#usage). |
In a nutshell, Expo CLI allows you to develop, compile, start your app, and more. See [Expo CLI reference](/more/expo-cli/) for more available options and actions you can perform with the CLI.
## EAS CLI
EAS CLI is used to log in to your Expo account and compile your app using different EAS services such as Build, Update, or Submit. You can also use this tool to:
- Publish your app to the app stores
- Create a development, preview, or production build of your app
- Create over-the-air (OTA) updates
- Manage your app credentials
- Create an ad hoc provisioning profile for an iOS device
To use EAS CLI, you need to install it globally on your local machine by running the command:
```sh
$ npm install -g eas-cli
```
You can use `eas --help` in your terminal window to learn more about the available commands. For a complete reference, see [`eas-cli` npm page](https://www.npmjs.com/package/eas-cli).
## Expo Doctor
Expo Doctor is a command line tool used to diagnose issues in your Expo project. To use it, run the following command in your project's root directory:
```sh
$ npx expo-doctor
```
This command performs checks and analyzes your project's codebase for common issues in [app config](/workflow/configuration/) and **package.json** files, dependency compatibility, configuration files, and the overall health of the project. Once the check is complete, Expo Doctor outputs the results.
If Expo Doctor finds an issue, it provides a description of the problem along with advice on how to fix it or where to find help.
By default, Expo Doctor validates your project's packages against the [React Native directory](https://reactnative.directory/) and checks if app config properties are properly synced when native directories exist. You can configure these checks in your project's **package.json** file. See [`reactNativeDirectoryCheck`](/versions/latest/config/package-json/#reactnativedirectorycheck) and [`appConfigFieldsNotSyncedCheck`](/versions/latest/config/package-json/#appconfigfieldsnotsynced) for more details.
You can also use `npx expo-doctor --help` to display usage information.
## Orbit
Orbit is a macOS and Windows app that enables:
- Install and launch builds from EAS on physical devices and emulators.
- Install and launch updates from EAS on Android Emulators or iOS Simulators.
- Launch snack projects on Android Emulators or iOS Simulators.
- Use local files to install and launch apps. Orbit supports any Android **.apk**, iOS Simulator compatible **.app**, or ad hoc signed apps.
- See a list of pinned projects from your EAS dashboard.
### Installation
For macOS: 
You can download Orbit with Homebrew for macOS, or directly from the [GitHub releases](https://github.com/expo/orbit/releases).
```sh
$ brew install expo-orbit
```
If you want Orbit to start when you log in automatically, click on the Orbit icon in the menu bar, then **Settings** and select the **Launch on Login** option.
For Windows: 
> **important** Orbit for Windows is in beta and is only compatible with x64 and x86 machines. Compatibility for other architectures will be added in the future.
You can download Orbit for Windows directly from the [GitHub releases](https://github.com/expo/orbit/releases).
> **info** Orbit relies on the Android SDK on both macOS and Windows and `xcrun` for device management only on macOS, which requires setting up both [Android Studio](/workflow/android-studio-emulator/) and [Xcode](/workflow/ios-simulator/).
{/* ### Usage */}
## Expo Tools for VS Code
Expo Tools is a VS Code extension to improve your development experience when working with app config files. It provides features such as autocomplete and intellisense for files such as app config, EAS config, store config and Expo Module config files.
You can also use it to debug your app using VS Code's built-in debugger to set breakpoints, inspect variables, execute code through the debug console, and more. See [Debugging with VS Code](/debugging/tools/#debugging-with-vs-code) for how to use this extension for debugging.
## Test prototypes with Snack and Expo Go
### Snack
Snack is an in-browser development environment that works similarly to Expo Go. It's a great way to share code snippets and experiment with React Native without downloading any tools on your computer.
To use it, go to [snack.expo.dev](https://snack.expo.dev/), edit the `<Text>` component in **App.js**, choose a platform (Android, iOS, or web) in the right panel and see the changes live.
### Expo Go
[Expo Go](https://expo.dev/go) is a free open-source, sandbox for learning and experimenting with React Native. It works with Android and iOS.
For more information on how to use it:
- Click [this link](/get-started/set-up-your-environment/?mode=expo-go) to go to Set up your environment guide
- Select a platform to develop under **Where would you like to develop?**
- Select Expo Go under **How would you like to develop?**
- Follow the instructions described in that guide
> **Note:** Not recommended for building and distributing production apps to the app stores. Instead, use [development builds](/get-started/set-up-your-environment/?mode=development-build).
Note: What if I open a project with an unsupported SDK version?
---
When running a project that was created for an unsupported SDK version in Expo Go, you'll see the following error:
```sh
"Project is incompatible with this version of Expo Go"
```
To fix this, upgrading your project to a [supported SDK version](/versions/latest/#each-expo-sdk-version-depends-on-a-react-native-version) is recommended. If you want to learn how to do it, see [Upgrade the project to a new SDK Version](#how-do-i-upgrade-my-project-from).
---
Note: How do I upgrade my project from an unsupported SDK version?
---
See [Upgrading Expo SDK guide](/workflow/upgrading-expo-sdk-walkthrough) for instructions for upgrading to a specific SDK version.
---
## React Native directory
Any library that is compatible with React Native works in an Expo project when you use a development build to create your project.
[reactnative.directory](https://reactnative.directory/) is a searchable database for React Native libraries. If a library you are looking for is not included in Expo SDK, use the directory to find a compatible library for your project.


## Navigation in Expo and React Native apps

Learn about the recommended approach for integrating navigation in an Expo and React Native project.

The core React Native library does not include a built-in navigation solution, so you can choose a navigation library that best fits your needs. For Expo and React Native apps, it is generally a choice between [React Navigation](https://reactnavigation.org/) or [Expo Router](/router/introduction/).
## Why React Native apps needs a navigation library
React Native core includes basic UI components, touch handling, device APIs and networking, but excludes, among other things, storage, camera, maps, most device sensors, and **navigation**! These are intended to be covered by community libraries.
## React Navigation
React Navigation is a component-based navigation library widely used across the React Native ecosystem. It lets you compose stack, tab, and drawer navigators entirely in code so you can implement complex flows, custom transitions, and app-specific UX patterns.
The library offers platform-specific look-and-feel with smooth animations and gestures, unified mobile and web routing, automatic deep links, type routes with static configuration, and is highly customizable.
## Expo Router (recommended for Expo projects)
Expo Router is a file-based routing library for Expo and React Native projects and is a built on top of React Navigation. By following the **app** directory convention, it turns files into routes and is integrated with Expo for [Expo CLI](/more/expo-cli/) and bundling without additional setup. The library also adds features such as typed routes, dynamic routes, lazy bundling in development, static rendering for the web, and automatic deep linking.
New Expo projects created with `npx create-expo-app@latest` include Expo Router by default so you can ship cross-platform navigation quickly while still being able to reach for React Navigation APIs when needed.


## Authentication in Expo and React Native apps

Learn about setting up authentication in your Expo project.

Authentication is a critical part of 90 to 95 percent of modern apps. This guide explains common methods, patterns, and solutions to help you implement authentication in your Expo app.
> **info** **TL;DR**: Auth is hard. If you want to skip the complexity, jump to the [Auth solutions](/#auth-solutions) section for ready-made solutions. Otherwise, keep reading.
Implementing authentication involves more than writing client-side code. You'll need to manage server requests, password flows, third-party providers like Google or Apple, email handling, and OAuth standards. It can get complex quickly.
There are several types of authentication methods. Some are simple and effective, while others offer a better user experience but require more work. Let's look at the most common approaches and how you can implement them.
## Navigation auth flow
Let's start with the basics: any authentication system needs to separate **public screens** (such as login or signup) from **protected screens** (such as home or profile). At the navigation level, it comes down to a simple check: is the user authenticated?
To begin, you can simulate this using a hardcoded boolean value, like `isAuthenticated = true`, and build your navigation logic around it. Once everything is working, you can plug in your real authentication flow.
Note: Using Expo Router
---
Expo Router v5 introduced [protected routes](/router/advanced/protected), which prevent users from accessing certain screens unless they are authenticated. This feature works well for client-side navigation and simplifies your setup.
If you're using an older version of Expo Router, you can use [redirects](/router/advanced/authentication-rewrites) instead. Redirects provide the same result but require a bit more manual configuration. They are still supported in Expo Router v5 for backward compatibility.
Video Tutorial: [Expo Router Protected Routes](https://www.youtube.com/watch?v=zHZjJDTTHJg)
---
Note: Using React Navigation
---
If you're using React Navigation, they offer a helpful [authentication flow guide](https://reactnavigation.org/docs/auth-flow/) that explains how to structure your navigation logic. It includes examples for both [static](https://reactnavigation.org/docs/auth-flow/?config=static#how-it-will-work) and [dynamic](https://reactnavigation.org/docs/auth-flow/?config=dynamic#how-it-will-work) approaches based on the user's authentication state.
---
Both Expo Router and React Navigation give you flexible tools to implement protected navigation based on whether the user is logged in.
## Email and password
Email and password is a popular option when adding authentication to your app.
To make this flow user-friendly, you also need to implement forgot password and reset password functionality so users who lose access to their accounts can recover them.
If you want a quicker solution, several services offer built-in email and password authentication, including [Clerk](/#clerk), [Supabase](/#supabase), [Cognito](/#cognito), [Firebase](/#firebase-auth), and [Better Auth](/#better-auth). Most of these have generous free tiers, but it is a good idea to evaluate pricing if your app grows quickly.
The biggest advantage of these services is their ease of integration. They usually offer clear documentation, starter kits, and prebuilt components that save you time.
Note: Security checklist (OWASP) and store-review gotchas
---
If you're building this flow yourself, be sure to review the [Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-cheat-sheet) by OWASP. It outlines best practices for password length, encryption, recovery, secure storage, and more.
> **info** Adding email and password authentication is usually enough to pass App Store and Play Store review. You can submit your app with this method first. If you include "Sign in with Google," Apple may reject your app unless you also support "Sign in with Apple." The same rule applies in reverse on Google Play.
---
## Passwordless login
Passwordless login removes the need for users to create or remember a password. Instead, they provide their email address or phone number during registration. Your app then sends a [magic link](https://auth0.com/docs/authenticate/passwordless/authentication-methods/email-magic-link#classic-login-flow-with-magic-links) or [one-time passcode (OTP)](https://en.wikipedia.org/wiki/One-time_password) to their inbox or device. This is a smoother experience for most users and reduces friction during onboarding.
Note: Magic Links
---
With magic links, the user receives an email containing a link that redirects them back into your app. If everything works correctly, the session is verified and established.
A key detail here is [deep linking](/linking/into-your-app). Since users leave the app to check their email, the link must open your app and route them to the correct screen. If deep linking fails, the session cannot be validated, and the login flow breaks.
If you're using Expo Router deep linking is handled automatically (for most cases). You usually don't need to configure anything extra to make magic links work properly, which makes this approach even easier to adopt. See [Linking into your app](/linking/into-your-app) to learn more.
[React Navigation](https://reactnavigation.org/) also supports deep linking, but you will need to configure it manually. See its [Deep Linking guide](https://reactnavigation.org/docs/deep-linking/) for more details.
---
Note: One-Time Passcodes (OTP)
---
An alternative to magic links is sending a one-time passcode by email or SMS. Instead of clicking a link, the user copies the code and manually returns to the app to enter it. This must happen within a specific time window before the code expires.
There's no deep linking involved here. The user stays in control of the flow and must return to the app themselves.
Fortunately, newer versions of Android and iOS automatically detect passcodes in incoming messages. This enables autofill suggestions above the keyboard, allowing users to enter the code with a single tap. When this works, the experience is seamless.
---
> **info** Magic links and passcodes are both valid authentication methods for Google Play Store and Apple App Store reviews. You can submit your app with either of these methods as the only option and get approved, even before adding social or OAuth login options.
## OAuth 2.0
To let your users log in using their existing accounts from services like Google, Apple, GitHub, and more, you can use OAuth 2.0.
[OAuth 2.0](https://oauth.net/2) is a widely used, secure protocol that allows your app to access user information from another service, without needing to handle passwords. It allows your users to log in with a single tap, which saves time, builds trust, and removes the need to manage passwords.
> **info** OAuth flows can be complex. If you're looking for a simple integration, most providers offer SDKs and services that handle everything for you. You can learn more about these in the [Auth solutions](#auth-solutions) section.
If you are looking for full control or want to understand how OAuth works under the hood, the following sections show how to implement a complete OAuth flow yourself using Expo.
### How OAuth works
OAuth works by introducing an authorization server that acts as a secure middleman. Instead of giving your app their password, users log in through this server and approve access to specific data (like their name or email). The server then issues a temporary code, which your app can exchange for a secure access token.
Once you understand this pattern, you can apply it to any provider. The setup for Google, Apple, or GitHub will follow the same general steps.
### Custom OAuth with Expo API Routes
The previous diagram shows a high-level overview of the OAuth flow. However, the preferred method for a client to obtain an authorization grant from the user is to use an authorization server as an intermediary, which is exactly what you can build using Expo API Routes.
The following diagram illustrates this flow in more detail:
Expo lets you implement the entire OAuth flow directly in your app using:
Some providers offer native APIs to handle the sign-in flow directly within the app. Google offers a native Sign in with Google experience on Android. If you're looking for a native implementation, see the [Google authentication guide](/guides/google-authentication). Apple provides Sign in with Apple, which uses a native bottom sheet and Face ID on iOS. See [`expo-apple-authentication`](/versions/latest/sdk/apple-authentication) reference.
The following setup gives you full control over the login experience across Android, iOS, and web.
Note: What are Expo API Routes?
---
[Expo Router API Routes](/router/web/api-routes) allow you to write server-side logic directly inside your Expo app. You can define functions that handle requests just like an Express or Next.js backend, no need for an external server.
This makes it easy to securely handle sensitive parts of the auth flow, like the [authorization code exchange](https://www.oauth.com/oauth2-servers/pkce/authorization-code-exchange), directly within your app. Since these routes run on the server, you can safely manage secrets, issue JWTs, and validate tokens.
> **info** You're essentially building a lightweight custom auth server scoped to your own application, all using your Expo project.
---
Note: What is Expo AuthSession?
---
[Expo AuthSession](/versions/latest/sdk/auth-session) is a client-side package that helps you open a web browser or native modal to start the OAuth login flow. It handles redirection, parses the authorization response, and brings the user back into your app.
It's the tool that kicks off the flow and talks to your API Route after the user authorizes access. See [Authentication with OAuth or OpenID providers](/guides/authentication/) for more information.
---
This setup lets you:
- Start the login flow using AuthSession
- Receive the auth code in your API Route
- Exchange the code for a token securely
- Generate a custom JWT with your own logic
- Return that token to the client
- Store sessions using cookies (Web) or JWTs (Native)
- Deploy instantly using EAS Hosting (free to start)
The following tutorials cover implementing OAuth on Android, iOS, and web, including how to create and verify custom JWTs, manage sessions, and protect API routes. If you're new to this flow, we recommend starting with the Google tutorial.
Video Tutorial: [Google Sign-In with Expo OAuth](https://www.youtube.com/watch?v=V2YdhR1hVNw)
Video Tutorial: [Sign in with Apple using Expo](https://www.youtube.com/watch?v=tqxTijhYhp8)
Note: Managing sessions after OAuth
---
Handling the OAuth flow securely is just the beginning. Once the user is authenticated, you need to think about how to store, restore, and validate their session.
This includes:
- Storing the session securely on the client
- Restoring it when the app restarts
- Protecting your API routes so only authenticated users can access them
Traditionally, [cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies#what_cookies_are_used_for) are used to store sessions on the web, while [JSON Web Tokens (JWTs)](https://en.wikipedia.org/wiki/JSON_Web_Token) are common in native applications.
The above tutorials demonstrate exactly how to handle this. After receiving the ID token from a provider like Google or Apple, you generate a custom JWT on the server using Expo API Routes.
This gives you full control over the session, including:
- Structuring the payload using consistent fields across providers
- Customizing expiration times
- Signing the token with a secret key so your server can verify it later
Once the token is created:
- For Android and iOS apps, you can store it securely using [`expo-secure-store`](/versions/latest/sdk/securestore/)
- For web apps, you can set it as a secure cookie to maintain the session
On every request, the token is sent back to your server, where you verify the signature and check the expiration. If everything checks out, you continue processing the request.
This session model keeps your backend stateless, scalable, and secure, and works consistently across platforms.
All of this is covered in the video tutorials linked above, including:
- Generating and verifying custom JWTs
- Handling session storage with Secure Store and cookies
- Protecting API routes with authentication logic
---
## Auth solutions
If you prefer not to build a full authentication system from scratch, several services offer built-in solutions with first-class support for Expo. Here are some of the most popular options:
Note: Better Auth
---
[BetterAuth](https://www.better-auth.com/docs/integrations/expo) is a modern, open-source authentication provider built for developers. It integrates smoothly with Expo, and they offer a guide that shows how to use it with [Expo API Routes](https://www.better-auth.com/docs/integrations/expo) for full control. It works well with any provider and deploys easily with EAS Hosting.
---
Note: Clerk
---
[Clerk](https://clerk.com/expo-authentication) is a powerful, full-featured authentication service with excellent Expo support. It includes email/password, passcodes, magic links, OAuth providers, and even passkeys. They also offer a native Expo module that handles much of the integration for you.
---
Note: Supabase
---
[Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native) provides a full backend platform, including a built-in authentication service that works with any OAuth provider. It integrates well with Expo apps and also includes support for email, magic links, and more.
---
Note: Cognito
---
[AWS Cognito](https://medium.com/@juliuscecilia33/aws-cognito-and-react-native-bf23ef7fea23) is Amazon's solution for managing user pools and identity. It connects seamlessly with other AWS services and can be integrated into Expo apps using AWS Amplify. It does require more configuration, but it's robust and scalable.
---
Note: Firebase Auth
---
[Firebase Authentication](https://rnfirebase.io/auth/usage) is Google's auth platform and supports email, magic links, and OAuth providers. It works with React Native through [`react-native-firebase`](https://github.com/invertase/react-native-firebase), which is compatible with Expo development builds.
---
## Modern methods
Once you have a working authentication system in place, you can improve the user experience by adding optional but powerful enhancements like biometrics and passkeys. These features add convenience, trust, and speed to your login flows.
Note: Biometrics
---
Biometrics like Face ID and Touch ID can be used to unlock the app or confirm identity after a valid session is established. These are not authentication methods on their own, but act as a local gate that makes re-authentication faster and more secure.
React Native provides access to biometric APIs through libraries like [`expo-local-authentication`](/versions/latest/sdk/local-authentication) or [`react-native-biometrics`](https://github.com/SelfLender/react-native-biometrics).
---
Note: Passkeys
---
[Passkeys](https://safety.google/authentication/passkey) are a new, passwordless way to log in to apps and websites. Backed by Apple, Google, and Microsoft, they use platform-level cryptography and biometrics to authenticate users without passwords.
Passkeys offer a seamless and secure experience, but they require a user to already be authenticated before registering one. They also require extra configuration if you're not using a provider that handles them for you.
- React Native passkey support: [`react-native-passkeys`](https://github.com/peterferguson/react-native-passkeys)
- Native passkey support with Clerk: [Clerk Passkeys for Expo](https://clerk.com/docs/references/expo/passkeys)
---
## Recommendations
This guide covers a lot of ground, from basic email and password flows to fully custom OAuth implementations, session management, and modern methods like biometrics and passkeys. Not all of these need to be implemented at once.
In many cases, starting simple is the best approach. Shipping your app with something like email authentication using a magic link or one-time passcode is often more than enough to get through the App Store review process and start collecting feedback from real users.
That said, if you're building an app where you expect high traffic from day one or need to support sign-in across platforms with minimal friction, investing in a more complete authentication flow early on can make a big difference. It can help improve user onboarding, trust, and retention right from the start.
Modern solutions like OAuth, biometrics, and passkeys are not required, but they can be excellent additions once your core system is in place.
The key is to build authentication that fits your current needs, while staying flexible enough to grow with your product.


## Unit testing with Jest

Learn how to set up and configure the jest-expo library to write unit and snapshot tests for a project with Jest.

[Jest](https://jestjs.io) is the most widely used unit and snapshot JavaScript testing framework. In this guide, you will learn how to set up Jest in your project, write a unit test, write a snapshot test, and best practices for structuring your tests when using Jest with React Native.
You will also use the [`jest-expo`](https://github.com/expo/expo/tree/main/packages/jest-expo) library, which is a Jest preset that mocks the native part of the Expo SDK and handles most of the configuration required for your Expo project.
## Installation and configuration
After creating your Expo project, follow the instructions below to install and configure `jest-expo` in your project:
Step 1: 
Install `jest-expo` and other required dev dependencies in your project. Run the following command from your project's root directory:
For macOS/Linux: 
```sh
$ npx expo install jest-expo jest @types/jest --dev
```
For Windows: 
```sh
$ npx expo install jest-expo jest @types/jest "--" --dev
```
> **Note:** If your project is not using TypeScript, you can skip installing `@types/jest`.
Step 2: 
Open **package.json**, add a script for running tests, and add the preset for using the base configuration from `jest-expo`:
```json package.json
{
  "scripts": {
  },
  "jest": {
    "preset": "jest-expo"
  }
}
```
Step 3: 
In **package.json**, add `jest-expo` as a preset so that a base for Jest's configuration is set up:
```json package.json
{
  "jest": {
    "preset": "jest-expo"
  }
}
```
Note: Additional configuration for using 
---
You can transpile node modules your project uses by configuring [`transformIgnorePatterns`](https://jestjs.io/docs/configuration#transformignorepatterns-arraystring) in your **package.json**. This property takes a regex pattern as its value:
For npm/Yarn: 
```json package.json
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)"
  ]
}
```
For pnpm: 
```json package.json
"jest": {
  "preset": "jest-expo",
  "transformIgnorePatterns": [
    "node_modules/(?!(?:.pnpm/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg))"
  ]
}
```
Jest has many configuration options, but the above configuration should cover most of your needs. However, you can always add to this pattern list. For more details, see [Configuring Jest](https://jestjs.io/docs/configuration).
---
## Install React Native Testing Library
The [React Native Testing Library (`@testing-library/react-native`)](https://callstack.github.io/react-native-testing-library/) is a lightweight solution for testing React Native components. It provides utility functions and works with Jest.
To install it, run the following command:
For macOS/Linux: 
```sh
$ npx expo install @testing-library/react-native --dev
```
For Windows: 
```sh
$ npx expo install @testing-library/react-native "--" --dev
```
> **warning** **Deprecated:** `@testing-library/react-native` replaces the deprecated `react-test-renderer` because `react-test-renderer` does not support React 19 and above. Remove the deprecated library from your project if you are currently using it. See [React's documentation for more information](https://react.dev/warnings/react-test-renderer).
## Unit test
A unit test checks the smallest unit of code, usually a function. To write your first unit test, take a look at the following example:
Step 1: 
Inside the **app** directory of your project, create a new file called **index.tsx**, and the following code to render a simple component:
```tsx index.tsx
import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
export const CustomText = ({ children }: PropsWithChildren) => <Text>{children}</Text>;
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <CustomText>Welcome!</CustomText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```
Step 2: 
Create a **__tests__** directory at the root of your project's directory. If this directory already exists in your project, use that. Then, create a new file called **HomeScreen-test.tsx**. The `jest-expo` preset customizes the Jest configuration to also identify files with **-test.ts|tsx** extensions as tests.
Add the following example code in **HomeScreen-test.tsx**:
```tsx HomeScreen-test.tsx
import { render } from '@testing-library/react-native';
import HomeScreen, { CustomText } from '@/app/index';
describe('<HomeScreen />', () => {
  test('Text renders correctly on HomeScreen', () => {
    const { getByText } = render(<HomeScreen />);
    getByText('Welcome!');
  });
});
```
In the above example, the `getByText` query helps your tests find relevant element in your app's user interface and make assertion whether or not the certain element exists. The React Native Testing Library provides this query, and each [query variant](https://callstack.github.io/react-native-testing-library/docs/api/queries#query-variant) differs in its return type. For more examples and detailed API information, see the React Native Testing Library's [Queries API reference](https://callstack.github.io/react-native-testing-library/docs/api/queries).
Step 3: 
Run the following command in a terminal window to execute the test:
```sh
$ npm run test
```
You will see one test being passed.
## Structure your tests
Organizing your test files is important to make them easier to maintain. A common pattern is creating a **__tests__** directory and putting all your tests inside.
An example structure of tests next to the **components** directory is shown below:
```
â”œâ”€â”€ __tests__/
â”‚   â””â”€â”€ ThemedText-test.tsx
â””â”€â”€ components/
    â”œâ”€â”€ ThemedText.tsx
    â””â”€â”€ ThemedView.tsx
```
Alternatively, you can have multiple **__tests__** sub-directories for different areas of your project. For example, create a separate test directory for **components**, and so on:
```
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ ThemedText.tsx
â”‚   â””â”€â”€ __tests__/
â”‚       â””â”€â”€ ThemedText-test.tsx
â””â”€â”€ utils/
    â”œâ”€â”€ index.tsx
    â””â”€â”€ __tests__/
        â””â”€â”€ index-test.tsx
```
It's all about preferences, and it is up to you to decide how you want to organize your project directory.
## Snapshot test
> **info** **Note:** For UI testing, we recommend end-to-end tests instead of snapshot unit tests. See the [E2E tests with Maestro](/eas/workflows/examples/e2e-tests/) guide.
A [snapshot test](https://jestjs.io/docs/en/snapshot-testing) is used to make sure that UI stays consistent, especially when a project is working with global styles that are potentially shared across components.
To add a snapshot test for `<HomeScreen />`, add the following code snippet in the `describe()` in **HomeScreen-test.tsx**:
```tsx HomeScreen-test.tsx
describe('<HomeScreen />', () => {
  test('CustomText renders correctly', () => {
    const tree = render(<CustomText>Some text</CustomText>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
```
Run `npm run test` command, and you will see a snapshot created inside **__tests__\__snapshots__** directory, and two tests passed.
## Code coverage reports
Code coverage reports can help you understand how much of your code is tested. To see the code coverage report in your project using the HTML format, in **package.json**, under `jest`, set the `collectCoverage` to true and use `collectCoverageFrom` to specify a list of files to ignore when collecting the coverage.
```json package.json
"jest": {
  ...
  "collectCoverage": true,
  "collectCoverageFrom": [
    "**/*.{ts,tsx,js,jsx}",
    "**/coverage/**",
    "**/node_modules/**",
    "**/babel.config.js",
    "**/expo-env.d.ts",
    "**/.expo/**"
  ]
}
```
Run `npm run test`. You will see a **coverage** directory created in your project. Find the **lcov-report/index.html** and open it in a browser to see the coverage report.
> Usually, we don't recommend uploading **index.html** file to git. Add `coverage/**/*` in the **.gitignore** file to prevent it from being tracked.
## Jest flows (optional)
You can also use different flows to run your tests. Below are a few example scripts that you can try:
```json package.json
"scripts": {
  "test": "jest --watch --coverage=false --changedSince=origin/main",
  "testDebug": "jest -o --watch --coverage=false",
  "testFinal": "jest",
  "updateSnapshots": "jest -u --coverage=false"
}
```
For more information, see [CLI Options](https://jestjs.io/docs/en/cli) in Jest documentation.
## Additional information


# User interface

## Splash screen and app icon

Learn how to add a splash screen and app icon to your Expo project.

A splash screen and an app icon are fundamental elements of a mobile app. They play an important role in the user experience and branding of the app. This guide provides steps on how to create and add them to your app.
Video Tutorial: [Create an App Icon and Splash Screen](https://www.youtube.com/watch?v=3Bsw8a1BJoQ)
---
## Splash screen
A splash screen, also known as a launch screen, is the first screen a user sees when they open your app. It stays visible while the app is loading. You can also control the behavior of when a splash screen disappears by using the native [SplashScreen API](/versions/latest/sdk/splash-screen).
The [`expo-splash-screen`](/versions/latest/sdk/splash-screen) has a built-in [config plugin](/config-plugins/introduction) that lets you configure properties such as the splash icon and background color.
> **warning** **Do not use Expo Go or a development build to test your splash screen**. Expo Go renders your app icon while the splash screen is visible, which can interfere with testing. Development builds include `expo-dev-client`, which has its own splash screen and may cause conflicts. **Instead, use a [preview build](/build/eas-json/#preview-builds) or a [production build](/build/eas-json/#production-builds)**.
Step 1: 
### Create a splash screen icon
To create a splash screen icon, you can use this [Figma template](https://www.figma.com/community/file/1466490409418563617). It provides a bare minimum design for an icon and splash images for Android and iOS.
**Recommended:**
- Use a 1024x1024 image.
- Use a **.png** file.
- Use a transparent background.
Step 2: 
### Export the splash icon as a .png
After creating a splash screen icon, export it as a **.png** and save it in the **assets/images** directory. By default, Expo uses **splash-icon.png** as the file name. If you decide to change the name of your splash screen file, make sure to use that in the next step.
> **Note:** **Currently, only .png images are supported** to use as a splash screen icon in an Expo project. If you use another image format, making a production build of your app will fail.
Step 3: 
### Configure the splash screen icon
Open the app config file, and under plugins, set the following properties:
```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#232323",
          "image": "./assets/images/splash-icon.png",
          "dark": {
            "image": "./assets/images/splash-icon-dark.png",
            "backgroundColor": "#000000"
          },
          "imageWidth": 200
        }
      ]
    ]
  }
}
```
To test your new splash screen, build your app for [internal distribution](/tutorial/eas/internal-distribution-builds) or for production, see guides on [Android](/tutorial/eas/android-production-build/) and [iOS](/tutorial/eas/ios-production-build/).
Note: Configuring  properties separately for Android and iOS
---
[`expo-splash-screen`](/versions/latest/sdk/splash-screen) also supports `android` and `ios` properties for configuring the splash screen for a specific platform. See the following example:
```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-splash-screen",
        {
          "ios": {
            "backgroundColor": "#ffffff",
            "image": "./assets/images/splash-icon.png",
            "resizeMode": "cover"
          },
          "android": {
            "backgroundColor": "#0c7cff",
            "image": "./assets/images/splash-android-icon.png",
            "imageWidth": 150
          }
        }
      ]
    ]
  }
}
```
---
Note: Not using prebuild?
---
If your app does not use [Expo Prebuild](/workflow/prebuild) (formerly the _managed workflow_) to generate the native **android** and **ios** directories, then changes in the app config will have no effect. For more information, see [how you can customize the configuration manually](https://github.com/expo/expo/tree/main/packages/expo-splash-screen#-installation-in-bare-react-native-projects).
---
Note: Troubleshooting: New splash screen not appearing on iOS
---
For SDK versions below 52, in iOS development builds, launch screens can sometimes remain cached between builds, making it harder to test new images. Apple recommends clearing the _derived data_ directory before rebuilding, this can be done with Expo CLI by running:
```sh
$ npx expo run:ios --no-build-cache
```
See [Apple's guide on testing launch screens](https://developer.apple.com/documentation/technotes/tn3118-debugging-your-apps-launch-screen) for more information.
---
## App icon
An app's icon is what your app users see on their device's home screen and app stores. Android and iOS have different and strict requirements.
Step 1: 
### Create an app icon
To create an app icon, you can use this [Figma template](https://www.figma.com/community/file/1466490409418563617). It provides a bare minimum design for an icon and splash images for Android and iOS.
Step 2: 
### Export the icon image as a .png
After creating an app icon, export it as **.png** and save it in the **assets/images** directory. By default, Expo uses **icon.png** as the file name. If you decide to use a different file name, make sure to use that in the next step.
Step 3: 
### Add the icon in app config
Open the app config and add the local path as the value of [`icon`](/versions/latest/config/app/#icon) property to point it to your new app icon:
```json app.json
{
  "icon": "./assets/images/icon.png"
}
```
Note: Custom configuration tips for Android and iOS
---
#### Android
Further customization of the Android icon is possible using the [`android.adaptiveIcon`](/versions/latest/config/app/#adaptiveicon) property, which will override both of the previously mentioned settings.
The Android Adaptive Icon is formed from two separate layers &mdash; a foreground image and a background color or image. This allows the OS to mask the icon into different shapes and also supports visual effects. For Android 13 and later, the OS supports a themed app icon that uses a wallpaper and theme to determine the color set by the device's theme.
The design you provide should follow the [Android Adaptive Icon Guidelines](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive) for launcher icons. You should also:
- Use **.png** files.
- Use the `android.adaptiveIcon.foregroundImage` property to specify the path to your foreground image.
- Use the `android.adaptiveIcon.monochromeImage` property to specify the path to your monochrome image.
- The default background color is white; to specify a different background color, use the `android.adaptiveIcon.backgroundColor` property. You can instead specify a background image using the `android.adaptiveIcon.backgroundImage` property. Make sure that it has the same dimensions as your foreground image.
You may also want to provide a separate icon for older Android devices that do not support Adaptive Icons. You can do so with the `android.icon` property. This single icon would be a combination of your foreground and background layers.
> See [Apple best practices](https://developer.apple.com/design/human-interface-guidelines/app-icons/#Best-practices) to ensure your icon looks professional, such as testing your icon on different wallpapers and avoiding text beside your product's wordmark. Provide an icon that's at least 512x512 pixels.
#### iOS
<VideoBoxLink
  videoId="RZ_QMym3adw"
  title="Icon Composer"
  description="Learn how to use the new Icon Composer to create app icons for an Expo project."
  className="mb-4"
/>
For iOS, your app's icon should follow the [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons/). You can use the [Icon Composer](https://developer.apple.com/icon-composer/) app to create your app icon. This will output a **.icon** directory that you can add to your project's **assets** directory. You can then provide the path to this directory in your app config. Adding support for dark mode is handled in Icon Composer, so you do not need to provide variants when using this approach.
> **info** **Note:** Providing an Icon Composer **.icon** directory via `ios.icon` is supported **in SDK 54** and later.
```json app.json
{
  "expo": {
    "ios": {
      "icon": "./assets/app.icon"
    }
  }
}
```
Alternatively, the previous approach of providing an image is still supported. You should:
- Use a **.png** file.
- 1024x1024 is a good size. If you have an Expo project created using `npx create-expo-app`, [EAS Build](/build/setup/) will generate the other sizes for you. In case of a bare React Native project, generate the icons on your own. The largest size EAS Build generates is 1024x1024.
- The icon must be exactly square. For example, a 1023x1024 icon is not valid.
- Make sure the icon fills the whole square, with no rounded corners or other transparent pixels. The operating system will mask your icon when appropriate.
- Use `ios.icon` to specify different icons for various system appearances (for example, dark and tinted) can be provided. If specified, this overrides the top-level icon key in the app config file. See the example below:
```json app.json
{
  "expo": {
    "ios": {
      "icon": {
        "dark": "./assets/images/ios-dark.png",
        "light": "./assets/images/ios-light.png",
        "tinted": "./assets/images/ios-tinted.png"
      }
    }
  }
}
```
---


## Safe areas

Learn how to add safe areas for screen components inside your Expo project.

Creating a safe area ensures your app screen's content is positioned correctly. This means it doesn't get overlapped by notches, status bars, home indicators, and other interface elements that are part of the device's physical hardware or are controlled by the operating system. When the content gets overlapped, it gets concealed by these interface elements.
Here's an example of an app screen's content getting concealed by the status bar on Android. On iOS, the same content is concealed by rounded corners, notch, and the status bar.
## Use `react-native-safe-area-context` library
[`react-native-safe-area-context`](https://github.com/AppAndFlow/react-native-safe-area-context) provides a flexible API for handling Android and iOS device's safe area insets. It also provides a `SafeAreaView` component that you can use instead of a [`<View>`](https://reactnative.dev/docs/view) to account for safe areas automatically in your screen components.
Using the library, the result of the previous example changes as it displays the content inside a safe area, as shown below:
### Installation
You can skip installing `react-native-safe-area-context` if you have created a project using [the default template](/get-started/create-a-project/). This library is installed as peer dependency for Expo Router library. Otherwise, install it by running the following command:
```sh
$ npx expo install react-native-safe-area-context
```
### Usage
You can directly use [`SafeAreaView`](https://appandflow.github.io/react-native-safe-area-context/api/safe-area-view) to wrap the content of your screen's component. It is a regular `<View>` with the safe area insets applied as extra padding or margin.
```tsx app/index.tsx
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>Content is in safe area.</Text>
    </SafeAreaView>
  );
}
```
Note: Using a different Expo template and don't have Expo Router installed?
---
Import and add [`SafeAreaProvider`](https://appandflow.github.io/react-native-safe-area-context/api/safe-area-provider) to the root component file (such as **App.tsx**) before using `SafeAreaView` in your screen component.
```tsx App.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
export default function App() {
  return (
    return <SafeAreaProvider>...</SafeAreaProvider>;
  );
}
```
---
## Alternate: `useSafeAreaInsets` hook
Alternate to `SafeAreaView`, you can use [`useSafeAreaInsets`](https://appandflow.github.io/react-native-safe-area-context/api/use-safe-area-insets) hook in your screen component. It provides direct access to the safe area insets, allowing you to apply padding for each edge of the `<View>` using an inset from this hook.
The example below uses the `useSafeAreaInsets` hook. It applies top padding to a `<View>` using `insets.top`.
```tsx app/index.tsx
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Text>Content is in safe area.</Text>
    </View>
  );
}
```
The hook provides the insets in the following object:
```ts
{
  top: number,
  right: number,
  bottom: number,
  left: number
}
```
## Additional information
### Minimal example
Below is a minimal working example that uses the `useSafeAreaInsets` hook to apply top padding to a view.
#### Using react-native-safe-area-context
```tsx collapseHeight=320
import { Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
function HomeScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <Text style={{ fontSize: 28 }}>Content is in safe area.</Text>
    </View>
  );
}
export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
```
### Usage with React Navigation
By default, React Navigation supports safe areas and uses `react-native-safe-area-context` as a peer dependency. For more information, see the [React Navigation documentation](https://reactnavigation.org/docs/handling-safe-area/).
### Usage with web
If you are targeting the web, set up `SafeAreaProvider` as described in the [usage section](#usage). If you are doing server-side rendering (SSR), see the [Web SSR section](https://appandflow.github.io/react-native-safe-area-context/optimizations#web-ssr) in the library's documentation.


## System bars

Learn how to handle and customize system bars for safe areas and edge-to-edge layout in your Expo project.

System bars are the UI elements at the edges of the screen that provide essential device information and navigation controls. Depending on the mobile OS, they include the status bar ([Android](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars) and [iOS](https://developer.apple.com/design/human-interface-guidelines/status-bars)), caption bar ([Android](https://medium.com/androiddevelopers/insets-handling-tips-for-android-15s-edge-to-edge-enforcement-872774e8839b#:~:text=or%20SHORT_EDGES.-,Caption%20bars,-When%20your%20app) only), navigation bar ([Android](https://developer.android.com/design/ui/mobile/guides/foundations/system-bars#navigation-bar) and [iOS](https://developer.apple.com/design/human-interface-guidelines/navigation-bars)), and home indicator (iOS only).
These components are used to display device information such as battery level, time, notification alerts, and provide direct interaction with the device from anywhere in the device's interface. For example, an app user can pull down the status bar to access quick settings and notifications regardless of which app they're currently using.
System bars are fundamental to the mobile experience, and understanding how to work with them properly is important for creating your app.
## Handling overlaps using safe areas
Some of your app's content may draw behind the system bars. To handle this, you need to position your app's content correctly by avoiding the overlap and ensuring that the controls from the system bars are present.
The following guide walks you through how to use `SafeAreaView` or a hook to apply insets directly for each edge of the screen.
### Safe areas and edge-to-edge layout on Android
Before [edge-to-edge on Android](https://expo.dev/blog/edge-to-edge-display-now-streamlined-for-android), it was common to have a translucent status bar and navigation bar. With this approach, the content drawn behind these bars was already underneath them, and it was typically not necessary to factor in safe areas.
Now, [with edge-to-edge on Android](https://expo.dev/blog/edge-to-edge-display-now-streamlined-for-android), you will need to use safe areas to ensure that content does not overlap with system bars.
## Customizing system bars
System bars can be customized to match your app's design and provide better visibility in different scenarios. When using Expo, there are two libraries available for this: `expo-status-bar` and `expo-navigation-bar` (Android only).
### Status bar configuration
The status bar appears at the top of the screen on both Android and iOS. You can customize it using [`expo-status-bar`](/versions/latest/sdk/status-bar). It provides a `StatusBar` component that you can use to control the appearance of the status bar while your app is running using the [`style`](/versions/latest/sdk/status-bar/#style) property or the [`setStatusBarStyle`](/versions/latest/sdk/status-bar/#statusbarsetstatusbarstylestyle-animated) method:
```tsx app/_layout.tsx
import { StatusBar } from 'expo-status-bar';
export default function RootLayout() {
  <>
    {/* Use light text instead of dark text in the status bar to provide more contrast with a dark background. */}
    <StatusBar style="light" />
  </>;
}
```
> **Note:** In Expo default template, the `style` property is set to `auto`. It automatically picks the appropriate style depending on the color scheme (light or dark mode) currently used by your app.
To control the `StatusBar` visibility, you can set the [`hidden`](/versions/latest/sdk/status-bar/#hidden) property to `true` or use the [`setStatusBarHidden`](/versions/latest/sdk/status-bar/#statusbarsetstatusbarhiddenhidden-animation) method.
**With edge-to-edge enabled on Android, features from `expo-status-bar` that depend on an opaque status bar [are unavailable](https://developer.android.com/about/versions/15/behavior-changes-15#edge-to-edge)**. It's only possible to customize the style and visibility. Other properties will no-op and warn.
### Navigation bar configuration (Android only)
On Android devices, the Navigation Bar appears at the bottom of the screen. You can customize it using the [`expo-navigation-bar`](/versions/latest/sdk/navigation-bar) library. It provides a `NavigationBar` component that you can use to set the style of the navigation bar using the [`setStyle`](/versions/latest/sdk/navigation-bar/#navigationbarsetstylestyle) method:
```tsx app/_layout.tsx
import { Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { useEffect } from 'react';
useEffect(() => {
  if (Platform.OS === 'android') {
    // Set the navigation bar style
    NavigationBar.setStyle('dark');
  }
}, []);
```
To control the `NavigationBar` visibility, you can use the [`setVisibilityAsync`](/versions/latest/sdk/navigation-bar/#navigationbarsetvisibilityasyncvisibility) method.
**With edge-to-edge enabled on Android, features from `expo-navigation-bar` that depend on an opaque navigation bar [are unavailable](https://developer.android.com/about/versions/15/behavior-changes-15#edge-to-edge)**. It's only possible to customize the style and visibility. Other properties will no-op and warn.


## Fonts

Learn how to integrate custom fonts in your app using local files or Google Font packages

Android and iOS come with their own set of platform fonts. To provide a consistent user experience and enhance your app's branding, you can use custom fonts.
This guide covers different ways you can add and load a custom font into your project and also provides additional information related to fonts.
## Add a custom font
There are two ways you can add a custom font into your project:
- Add a font file into your local assets. For example, a font file in the **assets/fonts** directory.
- Install a Google Font package. For example, installing [`@expo-google-fonts/inter`](https://www.npmjs.com/package/@expo-google-fonts/inter) package.
### Supported font formats
Expo SDK officially supports OTF and TTF font formats across Android, iOS and web platforms. If your font is in another font format, you have to set up advanced configuration to support that format in your project.
### Variable fonts
Variable fonts, including variable font implementations in OTF and TTF, do not have support across all platforms. For full platform support, use static fonts. Alternatively, use a utility such as [fontTools](https://fonttools.readthedocs.io/en/latest/varLib/mutator.html) to extract the specific axis configuration you want to use from the variable font and save it as a separate font file.
### How to choose between OTF and TTF
If the font you're using has both OTF and TTF versions, prefer OTF. The **.otf** files are smaller than **.ttf** files. Sometimes, OTF also renders slightly better in certain contexts.
## Use a local font file
Copy the file into your project's **assets/fonts** directory.
> **info** **assets/fonts** directory path is a common convention in React Native apps to put font files. You can place these files elsewhere if you follow a custom convention.
Two ways to use the local font file in your project:
- Embed the font file with [`expo-font` config plugin](/versions/latest/sdk/font/#configuration-in-app-config) (Android and iOS only).
- Load the font file with [`useFonts`](/versions/latest/sdk/font/#usefontsmap) hook at runtime (Android, iOS, and web).
### With `expo-font` config plugin
The `expo-font` config plugin allows embedding one or more font files in your project's native code. It supports `ttf` and `otf` for both Android and iOS, and `woff` and `woff2` are supported on iOS only.
> **Note:** Config plugins only run on native platforms (Android and iOS). For web, use the [`useFonts` hook](#with-usefonts-hook) instead.
This is the recommended method for adding fonts to your app due to its benefits:
- Fonts are available immediately when the app starts on a device.
- No additional code required to load fonts in a project asynchronously when the app starts.
- Fonts are consistently available across all devices where the app is installed because they're bundled within the app.
However, this method also has some limitations:
- Doesn't work with Expo Go since this method requires [creating a development build](/develop/development-builds/create-a-build/).
To embed a font in a project, follow the steps below:
Step 1: 
After adding a custom font file in your project, install the `expo-font` library.
```sh
$ npx expo install expo-font
```
Step 2: 
Add the config plugin to your [app config](/versions/latest/config/app/#plugins) file. The configuration must contain the path to the font file using [`fonts`, `android` or `ios`](/versions/latest/sdk/font/#configurable-properties) properties which take an array of one or more font definitions. The path to each font file is relative to the project's root.
For Android, you can specify the `fontFamily`, `weight`, and optionally `style` (defaults to "normal"), which will embed the fonts as native [XML resources](https://developer.android.com/develop/ui/views/text-and-emoji/fonts-in-xml). If you provide only the font file paths in an array, the file name becomes the font family name on Android. iOS always extracts the font family name from the font file itself.
If you plan to refer to fonts using just the `fontFamily`, provide an array of font paths (see `FiraSans-MediumItalic.ttf` below) and follow our [recommendation for file naming](#how-to-determine-which-font-family-name-to-use).
If you want to refer to fonts using a combination of `fontFamily`, `weight`, and `style`, provide an array of objects (see `Inter` below).
```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/FiraSans-MediumItalic.ttf"
          ],
          "android": {
            "fonts": [
              {
                "fontFamily": "Inter",
                "fontDefinitions": [
                  {
                    "path": "./assets/fonts/Inter-BoldItalic.ttf",
                    "weight": 700,
                    "style": "italic"
                  },
                  {
                    "path": "./assets/fonts/Inter-Bold.ttf",
                    "weight": 700
                  }
                ]
              }
            ]
          },
          "ios": {
            "fonts": ["./assets/fonts/Inter-Bold.ttf", "./assets/fonts/Inter-BoldItalic.ttf"]
          }
        }
      ]
    ]
  }
}
```
Step 3: 
After embedding the font with the config plugin, create a [new development build](/develop/development-builds/create-a-build/) and install it on your device or Android Emulator or iOS Simulator.
You can use the font with `<Text>` by specifying the `fontFamily` style prop. The examples below correspond to the fonts defined in the configuration above.
```tsx
<Text style={{ fontFamily: 'Inter', fontWeight: '700' }}>Inter Bold</Text>
<Text style={{ fontFamily: 'Inter', fontWeight: '700', fontStyle: 'italic' }}>Inter Bold Italic</Text>
<Text style={{ fontFamily: 'FiraSans-MediumItalic' }}>Fira Sans Medium Italic</Text>
```
<ConfigReactNative title="Using this method in an existing React Native project?">
- **Android:** Copy font files to **android/app/src/main/assets/fonts**.
- **iOS:** See [Adding a Custom Font to Your App](https://developer.apple.com/documentation/uikit/text_display_and_fonts/adding_a_custom_font_to_your_app) in the Apple Developer documentation.
</ConfigReactNative>
#### How to determine which font family name to use
- If you provide fonts as an array of file paths (as described above), on Android, the file name (without the extension) becomes the font family name. On iOS, the font family name is read from the font file itself. We recommend naming the font file same as its [PostScript name](#what-is-postscript-name-of-a-font) so the font family name is consistent on both platforms.
- If you use the object syntax, provide the "Family Name". This can be found in the Font Book app on macOS, [fontdrop.info](https://fontdrop.info/) or other programs.
Note: What is PostScript name of a font file?
---
The **PostScript name** of a font file is a unique identifier assigned to the font that follows Adobe's PostScript standard. It is used by operating systems and apps to refer to the font. It is not a font's **display name**.
For example, Inter Black font file's PostScript name is `Inter-Black`.
_Screenshot from Font Book app on macOS._
---
### With `useFonts` hook
The `useFonts` hook from `expo-font` library allows loading the font file asynchronously. This hook keeps track of the loading state and loads the font when an app is initialized.
It works with all Expo SDK versions and with Expo Go. To load a font in a project using `useFonts` hook, follow the steps below:
Step 1: 
After adding a custom font file in your project, install the `expo-font` and `expo-splash-screen` libraries.
```sh
$ npx expo install expo-font expo-splash-screen
```
The [`expo-splash-screen`](/versions/latest/sdk/splash-screen/) library provides `SplashScreen` component that you can use to prevent rendering the app until the font is loaded and ready.
Step 2: 
Map the font file using the `useFonts` hook in a top level component such as the root layout (**app/layout.tsx**) file in your project:
```tsx app/_layout.tsx
import {useEffect} from 'react';
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  if (!loaded && !error) {
    return null;
  }
  return (
  )
}
```
Step 3: 
Use the font on the `<Text>` by using `fontFamily` style prop in a React component:
```tsx
<Text style={{ fontFamily: 'Inter-Black' }}>Inter Black</Text>
```
## Use Google Fonts
Expo has first-class support for all fonts listed in [Google Fonts](https://fonts.google.com/). They are available using [`@expo-google-fonts`](https://github.com/expo/google-fonts) library. With any of the font package from this library, you can quickly integrate that font and its variants.
Two ways to use a Google Font in your project:
- Embed the installed font with [`expo-font` config plugin](/versions/latest/sdk/font/#configuration-in-appjsonappconfigjs).
- Load the installed font with [`useFonts`](/versions/latest/sdk/font/#usefontsmap) hook at runtime asynchronously.
### With `expo-font` config plugin
> **Note:** Embedding a Google Font using `expo-font` config plugin has same benefits and limitations as embedding a custom font on your own. See [using a local font file with `expo-font` config plugin](#with-expo-font-config-plugin) for more information.
Step 1: 
Install the font package. For example, to use Inter Black font, install the [`@expo-google-fonts/inter`](https://www.npmjs.com/package/@expo-google-fonts/inter) package with the command below.
```sh
$ npx expo install expo-font @expo-google-fonts/inter
```
Step 2: 
Add the config plugin to your [app config](/versions/latest/config/app/#plugins) file. The configuration must contain the path to the font file using [`fonts`](/versions/latest/sdk/font/#configurable-properties) property which takes an array of one or more font files. The path to the font file is defined from the font package inside the `node_modules` directory. For example, if you have a font package named `@expo-google-fonts/inter`, then the name of the file is **Inter_900Black.ttf**.
```json app.json
{
  "plugins": [
    [
      "expo-font",
      {
        "fonts": ["node_modules/@expo-google-fonts/inter/900Black/Inter_900Black.ttf"]
      }
    ]
  ]
}
```
Step 3: 
After embedding the font with the config plugin, create a [new development build](/develop/development-builds/create-a-build/) and install it on your device or Android Emulator or iOS Simulator.
On Android, you can use the font file name. For example, `Inter_900Black`. On iOS, use the font and its weight name ([PostScript name](#what-is-postscript-name-of-a-font)). The example below demonstrates how to use [`Platform`](https://reactnative.dev/docs/platform-specific-code#platform-module) to select the correct font family name for each platform:
```tsx
<Text
  style={{
    fontFamily: Platform.select({
      android: 'Inter_900Black',
      ios: 'Inter-Black',
    }),
  }}>
  Inter Black
</Text>
```
### With `useFonts` hook
> **Note:** Loading a Google Font using `useFonts` hook has same benefits and limitations as embedding a custom font on your own. See [using a local font file with `useFonts` hook](#with-usefonts-hook) for more information.
Each google Fonts package provides the `useFonts` hook to load the fonts asynchronously. This hook keeps track of the loading state and loads the font when an app is initialized. The font package also imports the font file so you don't have to explicitly import it.
Step 1: 
Install the Google Fonts package, `expo-font` and `expo-splash-screen` libraries.
```sh
$ npx expo install @expo-google-fonts/inter expo-font expo-splash-screen
```
The [`expo-splash-screen`](/versions/latest/sdk/splash-screen/) library provides `SplashScreen` component that you can use to prevent rendering the app until the font is loaded and ready.
Step 2: 
After installing the font package, map the font using the `useFonts` hook in a top level component such as the root layout (**app/layout.tsx**) file in your project:
```tsx app/_layout.tsx
// Rest of the import statements
import { Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_900Black,
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  if (!loaded && !error) {
    return null;
  }
  return (
  )
}
```
Step 3: 
Use the font on the `<Text>` by using `fontFamily` style prop in a React component:
```tsx
<Text style={{ fontFamily: 'Inter_900Black' }}>Inter Black</Text>
```
## Additional information
### Minimal example
### Beyond OTF and TTF
If your font is in format other than OTF or TTF, you have to [customize the Metro bundler configuration to include it as an extra asset](/guides/customizing-metro#adding-more-file-extensions-to-assetexts) for it to work. In some cases, rendering a font format that a platform doesn't support may cause your app to crash.
For reference, the following table provides the list formats that work on each native platform:
| Format | Android     | iOS         | Web         |
| ------ | ----------- | ----------- | ----------- |
| bdf    | <NoIcon />  | <NoIcon />  | <NoIcon />  |
| dfont  | <YesIcon /> | <NoIcon />  | <NoIcon />  |
| eot    | <NoIcon />  | <NoIcon />  | <YesIcon /> |
| fon    | <NoIcon />  | <NoIcon />  | <NoIcon />  |
| otf    | <YesIcon /> | <YesIcon /> | <YesIcon /> |
| ps     | <NoIcon />  | <NoIcon />  | <NoIcon />  |
| svg    | <NoIcon />  | <NoIcon />  | <YesIcon /> |
| ttc    | <NoIcon />  | <NoIcon />  | <NoIcon />  |
| ttf    | <YesIcon /> | <YesIcon /> | <YesIcon /> |
| woff   | <NoIcon />  | <YesIcon /> | <YesIcon /> |
| woff2  | <NoIcon />  | <YesIcon /> | <YesIcon /> |
### Platform built-in fonts
If you don't want to use a custom font by specifying a `fontFamily`, platform's default font will be used. Each platform has a set of built in fonts. On Android, the default font is Roboto. On iOS, it's SF Pro.
A platform's default font is usually easy-to-read. However, don't be surprised when the system default font is changed to use another font that is not easy to read. In this case, use your custom font so you have precise control over what the user will see.
### Handle `@expo/vector-icons` initial load
When the icons from `@expo/vector-icons` library load for the first time, they appear as invisible icons in your app. Once they load, they're cached for all the app's subsequent usage. To avoid showing invisible icons on your app's first load, preload during the initial loading screen with [`useFonts`](/versions/latest/sdk/font/#usefontsmap). For example:
```tsx app/_layout.tsx
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
export default function RootLayout() {
  useFonts([require('./assets/fonts/Inter-Black.otf', Ionicons.font)]);
  return (
  )
}
```
Now, you can use any icon from the `Ionicons` library in a React component:
```tsx
<Ionicons name="checkmark-circle" size={32} color="green" />
```
### Loading a remote font directly from the web
> **warning** **If you're loading remote fonts, make sure they are being served from an origin with CORS properly configured**. If you don't do this, your remote font might not load properly on the web platform.
Loading fonts from a local asset is the safest way to load a font in your app. When including fonts as local assets, after you submit your app to the app stores, these fonts are bundled with the app download and will be available immediately. You don't have to worry about CORS or other potential issues.
However, loading a font file directly from web is done by replacing the `require('./assets/fonts/FontName.otf')` with the URL of your font as shown in the example below.
#### Using a remote font
```tsx
import { useFonts } from 'expo-font';
import { Text, View, StyleSheet } from 'react-native';
export default function App() {
  const [loaded, error] = useFonts({
    'Inter-SemiBoldItalic': 'https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12',
  });
  if (!loaded || !error) {
    return null;
  }
  return (
    <View style={styles.container}>
      <Text style={{ fontFamily: 'Inter-SemiBoldItalic', fontSize: 30 }}>Inter SemiBoldItalic</Text>
      <Text style={{ fontSize: 30 }}>Platform Default</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```


## Assets

Learn about using static assets in your project, including images, videos, sounds, database files, and fonts.

A **static asset** is a file that is bundled with your app's binary (native binary). This file type is not part of your app's JavaScript bundle which contain your app's code. Common types of static assets include images, videos, sounds, database files for SQLite, and fonts. These assets can be served locally from your project or remotely over the network.
This guide covers different ways you can load and use static assets in your project and also provides additional information on how to optimize and minify assets.
## Serve an asset locally
When an asset is stored in your project's file system, it can be embedded in your app binary at build time or loaded at runtime. You can import it like a JavaScript module using `require` or `import` statements.
For example, to render an image called **example.png** in **App.js**, you can use `require` to import the image from the project's **assets/images** directory and pass it to the `<Image>` component:
```tsx app/index.tsx
<Image source={require('./assets/images/example.png')} />
```
In the above example, the bundler reads the imported image's metadata and automatically provides the width and height. For more information, see [Static Image Resources](https://reactnative.dev/docs/images#static-image-resources).
Libraries such as `expo-image` and `expo-file-system` work similarly to the `<Image>` component with local assets.
### How are assets served locally
Locally stored assets are served over HTTP in development. They are automatically bundled into your app binary at the build time for production apps and served from disk on a device.
### Load an asset at build time with `expo-asset` config plugin
To load an asset at build time, you can use the [config plugin](/versions/latest/sdk/asset/#example-appjson-with-config-plugin) from the `expo-asset` library. This plugin will embed the asset file in your native project.
Step 1: 
Install the `expo-asset` library.
```sh
$ npx expo install expo-asset
```
Step 2: 
Add the config plugin to your project's [app config](/versions/latest/config/app/#plugins) file. The configuration must contain the path to the asset file using [`assets`](/versions/latest/sdk/asset/#configurable-properties) property which takes an array of one or more files or directories to link to the native project.
The path to each asset file must be relative to your project's root since the app config file is located in the project's root directory.
```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-asset",
        {
          "assets": ["./assets/images/example.png"]
        }
      ]
    ]
  }
}
```
Step 3: 
After embedding the asset with the config plugin, [create a new development build](/develop/development-builds/create-a-build/). Now, you can import and use the asset in your project without using a `require` or an `import` statement.
For example, the **example.png** is linked by the above config plugin. You can directly import it into your component and use its resource name as the URI. Note that when rendering assets without using `require`, you need to explicitly provide a width / height.
```tsx app/index.tsx
import { Image } from 'expo-image';
export default function HomeScreen() {
  return <Image source={{ uri: 'example' }} style={{ width: 100, height: 100 }} />;
}
```
> **info** Different file formats are supported with the `expo-asset` config plugin. For more information on these formats, see [Assets API reference](/versions/latest/sdk/asset/#configurable-properties). If you don't see a file format supported by the config plugin, you can use the [`useAssets`](#load-an-asset-at-runtime-with-useassets-hook) hook to load the asset at runtime.
### Load an asset at runtime with `useAssets` hook
The `useAssets` hook from `expo-asset` library allows loading assets asynchronously. This hook downloads and stores an asset locally and after the asset is loaded, it returns a list of that asset's instances.
Step 1: 
Install the `expo-asset` library.
```sh
$ npx expo install expo-asset
```
Step 2: 
Import the [`useAssets`](/versions/latest/sdk/asset/#useassetsmoduleids) hook from the `expo-asset` library in your screen component:
```tsx app/index.tsx
import { useAssets } from 'expo-asset';
export default function HomeScreen() {
  const [assets, error] = useAssets([
    require('path/to/example-1.jpg'),
    require('path/to/example-2.png'),
  ]);
  return assets ? <Image source={assets[0]} /> : null;
}
```
## Serve an asset remotely
When an asset is served remotely, it is not bundled into the app binary at build time. You can use the URL of the asset resource in your project if it is hosted remotely. For example, pass the URL to the `<Image>` component to render a remote image:
```jsx App.js
import { Image } from 'expo-image';
function App() {
  return (
    <Image source={{ uri: 'https://example.com/logo.png' }} style={{ width: 50, height: 50 }} />
  );
}
```
There is no guarantee about the availability of images served remotely using a web URL because an internet connection may not be available, or the asset might be removed.
Additionally, loading assets remotely also requires you to provide an asset's metadata. In the above example, since the bundler cannot retrieve the image's width and height, those values are passed explicitly to the `<Image>` component. If you don't, the image will default to 0px by 0px.
## Additional information
### Manual optimization methods
#### Images
You can compress images using the following:
- [`guetzli`](https://github.com/google/guetzli)
- [`pngcrush`](https://pmt.sourceforge.io/pngcrush/)
- [`optipng`](http://optipng.sourceforge.net/)
Some image optimizers are lossless. They re-encode your image to be smaller without any change or loss in the pixels displayed. When you need each pixel to be untouched from the original image, a lossless optimizer and a lossless image format like PNG are a good choice.
Other image optimizers are lossy. The optimized image differs from the original image. Often, lossy optimizers are more efficient because they discard visual information that reduces file size while making the image look nearly identical to humans. Tools like `imagemagick` can use comparison algorithms like [SSIM](https://en.wikipedia.org/wiki/Structural_similarity) to show how similar two images look. It's quite common for an optimized image that is over 95% similar to the original image to be far less than 95% of the original file size.
#### Other assets
For assets like GIFs or videos, or non-code and non-image assets, it's up to you to optimize and minify those assets.
> **Note**: GIFs are a very inefficient format. Modern video codecs can produce significantly smaller file sizes with better quality.
### Fonts
See [Add a custom font](/develop/user-interface/fonts/#add-a-custom-font) for more information on how to add a custom font to your app.


## Color themes

Learn how to support light and dark modes in your app.

It's common for apps to support light and dark color schemes. Here is an example of how supporting both modes looks in an Expo project:
## Configuration
> **info** For Android and iOS projects, additional configuration is required to support switching between light and dark mode. For web, no additional configuration is required.
To configure supported appearance styles, you can use the [`userInterfaceStyle`](/versions/latest/config/app/#userinterfacestyle) property in your project's [app config](/versions/latest/config/app). By default, this property is set to `automatic` when you create a new project with the [default template](/get-started/create-a-project/).
Here is an example configuration:
```json app.json
{
  "expo": {
    "userInterfaceStyle": "automatic"
  }
}
```
You can also configure `userInterfaceStyle` property for a specific platforms by setting either [`android.userInterfaceStyle`](/versions/latest/config/app/#userinterfacestyle-2) or [`ios.userInterfaceStyle`](/versions/latest/config/app/#userinterfacestyle-1) to the preferred value.
> **info** The app will default to the `light` style if this property is absent.
When you are creating a development build, you have to install [`expo-system-ui`](/versions/latest/sdk/system-ui/#installation) to support the appearance styles for Android. Otherwise, the `userInterfaceStyle` property is ignored.
```sh
$ npx expo install expo-system-ui
```
If the project is misconfigured and doesn't have `expo-system-ui` installed, the following warning will be shown in the terminal:
```sh
Â» android: userInterfaceStyle: Install expo-system-ui in your project to enable this feature.
```
You can also use the following command to check if the project is misconfigured:
```sh
$ npx expo config --type introspect
```
Note: Using bare React Native app?
---
#### Android
Ensure that the `uiMode` flag is present on your `MainActivity` (and any other activities where this behavior is desired) in **AndroidManifest.xml**:
```xml
<activity android:configChanges="keyboard|keyboardHidden|orientation|screenSize|uiMode">
```
Implement the `onConfigurationChanged` method in **MainActivity.java**:
```java
import android.content.Intent;
import android.content.res.Configuration;
public class MainActivity extends ReactActivity {
  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    sendBroadcast(intent);
  }
}
```
#### iOS
You can configure supported styles with the [`UIUserInterfaceStyle`](https://developer.apple.com/documentation/bundleresources/information_property_list/uiuserinterfacestyle) key in your app **Info.plist**. Use `Automatic` to support both light and dark modes.
---
### Supported appearance styles
The `userInterfaceStyle` property supports the following values:
- `automatic`: Follow system appearance settings and notify about any change the user makes.
- `light`: Restrict the app to support light theme only.
- `dark`: Restrict the app to support dark theme only.
## Detect the color scheme
To detect the color scheme in your project, use `Appearance` or `useColorScheme` from `react-native`:
```tsx app/index.tsx
import { Appearance, useColorScheme } from 'react-native';
```
Then, you can use `useColorScheme()` hook as shown below:
```tsx app/index.tsx
function MyComponent() {
  let colorScheme = useColorScheme();
  if (colorScheme === 'dark') {
    // render some dark thing
  } else {
    // render some light thing
  }
}
```
In some cases, you will find it helpful to get the current color scheme imperatively with [`Appearance.getColorScheme()` or listen to changes with `Appearance.addChangeListener()`](https://reactnative.dev/docs/appearance). 
## Additional information
### Minimal example
#### useColorScheme example
```tsx
import { StatusBar } from 'expo-status-bar';
export default function App() {
  const colorScheme = useColorScheme();
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  return (
    <View style={[styles.container, themeContainerStyle]}>
      <Text style={[styles.text, themeTextStyle]}>Color scheme: {colorScheme}</Text>
      <StatusBar />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  lightContainer: {
    backgroundColor: '#d0d0c0',
  },
  darkContainer: {
    backgroundColor: '#242c40',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  },
});
```
### Tips
While you are developing your project, you can change your simulator's or device's appearance by using the following shortcuts:
- If using an Android Emulator, you can run `adb shell "cmd uimode night yes"` to enable dark mode, and `adb shell "cmd uimode night no"` to disable dark mode.
- If using a physical Android device or an Android Emulator, you can toggle the system dark mode setting in the device's settings.
- If working with an iOS emulator locally, you can use the <kbd>Cmd âŒ˜</kbd> + <kbd>Shift</kbd> + <kbd>a</kbd> shortcut to toggle between light and dark modes.


## Animation

Learn how to integrate React Native animations and use it in your Expo project.

Animations are a great way to enhance and provide a better user experience. In your Expo projects, you can use the [Animated API](https://reactnative.dev/docs/next/animations) from React Native. However, if you want to use more advanced animations with better performance, you can use the [`react-native-reanimated`](https://docs.swmansion.com/react-native-reanimated/) library. It provides an API that simplifies the process of creating smooth, powerful, and maintainable animations.
## Installation
You can skip installing `react-native-reanimated` if you have created a project using [the default template](/get-started/create-a-project/). This library is already installed. Otherwise, install it by running the following command:
```sh
$ npx expo install react-native-reanimated
```
## Usage
### Minimal example
The following example shows how to use the `react-native-reanimated` library to create a simple animation. For more information on the API and advanced usage, see [`react-native-reanimated` documentation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation).
#### Using react-native-reanimated
```tsx
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { View, Button, StyleSheet } from 'react-native';
export default function AnimatedStyleUpdateExample() {
  const randomWidth = useSharedValue(10);
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };
  const style = useAnimatedStyle(() => {
    return {
      width: withTiming(randomWidth.value, config),
    };
  });
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]} />
      <Button
        title="toggle"
        onPress={() => {
          randomWidth.value = Math.random() * 350;
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 80,
    backgroundColor: 'black',
    margin: 30,
  },
});
```
## Other animation libraries
You can use other animation packages such as [Moti](https://moti.fyi/) in your Expo project. It works on Android, iOS, and web.


## Store data

Learn about different libraries available to store data in your Expo project.

Storing data can be essential to the features implemented in your mobile app. There are different ways to save data in your Expo project depending on the type of data you want to store and the security requirements of your app. This page lists a variety of libraries to help you decide which solution is best for your project.
## Expo SecureStore
`expo-secure-store` provides a way to encrypt and securely store key-value pairs locally on the device.
## Expo FileSystem
`expo-file-system` provides access to a file system stored locally on the device. Within Expo Go, each project has a separate file system and no access to other Expo projects' files. However, it can save content shared by other projects to the local filesystem and share local files with other projects. It is also capable of uploading and downloading files from network URLs.
## Expo SQLite
`expo-sqlite` package gives your app access to a database that can be queried through a WebSQL-like API. The database is persisted across restarts of your app. You can use it for importing an existing database, opening databases, creating tables, inserting items, querying and displaying results, and using prepared statements.
## Async Storage
[Async Storage](https://react-native-async-storage.github.io/async-storage/) is an asynchronous, unencrypted, persistent key-value storage for React Native apps. It has a simple API and is a good choice for storing small amounts of data. It is also a good choice for storing data that does not need encryption, such as user preferences or app state.
## Other libraries
There are other libraries available for storing data for different purposes. For example, you might not need encryption in your project or are looking for a faster solution similar to Async Storage.
We recommend checking out [React Native for a list of libraries](https://reactnative.directory/?search=storage) to help you store your project's data.


## Next steps

A list of useful resources to learn more about implementing navigation and UI in your app.

# Development builds

## Introduction to development builds

Why use development builds and how to get started.

**Development build** is the term that we use for a "Debug" build of an app that includes the [`expo-dev-client`](/versions/latest/sdk/dev-client/) library. This library augments the built-in React Native development tooling with additional capabilities, such as support for inspecting network requests and a "launcher" UI that lets you switch between different development servers (such as between a server running on your machine or a teammate's machine) and deployments of your app (such as published updates with EAS Update).
Note: Difference between Expo Go and development builds
---
When you create your first React Native project with `npx create-expo-app` and ran it with `npx expo start`, you most likely start off using the [Expo Go](https://expo.dev/go) app for development. Expo Go is a native app that the Expo team built and submitted to the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) and [Apple App Store](https://apps.apple.com/us/app/expo-go/id982107779) so you can get coding quickly. It is a sandbox app with a number of native libraries included within (see the [dependencies list](https://github.com/expo/expo/blob/main/apps/expo-go/package.json#L23)). This means that developers may update their app's JavaScript code on their local machine and see the changes on Expo Go.
A React Native app consists of two parts: the **native app (Expo Go)** and the **JavaScript bundle (`npx expo start`)**. It is immutable and when you're using the Expo Go app for development, you can only rely on the native code and tools that exist in Expo Go. The only way to get around it is to build your native app yourself instead of using Expo's pre-packaged sandbox. This is exactly what a **Development Build is, your own version of Expo Go**, where you are free to use any native libraries and change any native config.
---
Note: Native app and JavaScript bundle
---
The **native app (Expo Go)** is immutable once installed. Native build tools are required to create this bundle, and it needs to be signed to be installable on real devices. To add a new library with native code or change metadata that is shipped with the app (for example app name, icon, splash screen) the app needs to be rebuilt and re-installed on the device.
The **JavaScript bundle (`npx expo start`)** is where your app's UI code and business logic are. In production apps, there is one **main.js** bundle that is shipped with the app itself. In development, this JS bundle is live reloaded from your local machine. The main role of React Native is to provide a way for the JavaScript code to access the native APIs (Image, Camera, Notifications, and more). However, only APIs and libraries that were bundled in the **native app** can be used.
---
Video Tutorial: [Expo Go & Development Builds: which should you use?](https://www.youtube.com/watch?v=FdjczjkwQKE)
## Why use a development build (a.k.a what _can't_ you do in Expo Go and why)
Expo Go is the perfect tool for learning, prototyping, and experimenting, but most production apps will convert to using development builds sooner rather than later. It helps to know exactly what is _impossible_ in Expo Go and _why_, so you can make an informed decision on when and why to make this move.
Note: Use libraries with native code that aren't in Expo Go
---
Consider [`react-native-webview`](/versions/latest/sdk/webview/) as an example, a library that contains native code, but [is included in Expo Go](https://github.com/expo/expo/blob/main/apps/expo-go/package.json#L23). When you run `npx expo install react-native-webview` command in your project, it will install the library in your **node_modules** directory, which includes both the JS code and the native code. But the JS bundle you are building _only_ uses the JS code. Then, your JS bundle gets uploaded to Expo Go, and it interacts with the native code that was already bundled with the app.
Instead, when you try to use a library that is not included, for example, [`react-native-firebase`](/guides/using-firebase/#using-react-native-firebase), then you can use the JS code and hot reload the new bundle into Expo Go but it will immediately error because the JS code tries to call the native code from the React Native Firebase package that does not exist in Expo Go. There is no way to get the native code into the Expo Go app unless it was already included in the bundle that was uploaded to the app stores.
---
Note: Test changes in app icon, name, splash screen
---
If you're developing your app in Expo Go only, you can build a store version that will use your provided values and images; it just won't be possible to test it in Expo Go.
These native assets are shipped with the native bundle and are immutable once the app is installed. The Expo Go app does show a splash screen, which is your app icon on a solid color background. This is a dev-only emulation to view how the splash screen will probably look. However, it is limited, for example, you cannot test `SplashScreen.setOptions` to animate the splash screen.
---
Note: Remote push notifications
---
While [in-app notifications](/versions/latest/sdk/notifications/) are available in Expo Go, remote push notifications (that is, sending a push notification from a server to the app) are not. This is because a push notification service should be tied to your own push notification certificates, and while it is possible to make it work in Expo Go, it often causes confusion for production builds. It is recommended to test remote push notifications in development builds so you can ensure parity in behavior between development and production.
---
Note: Implementing App/Universal links
---
Both [Android App Links](/linking/android-app-links/) and [iOS Universal Links](/linking/ios-universal-links/) require a two-way association between the native app and the website. In particular, it requires the native app to include the linked website's URL. This is impossible with Expo Go due to the aforementioned native code immutability.
---
Note: Open projects using older SDKs (iOS device only)
---
Expo Go can only support one SDK version at a time. When a new SDK version is released, Expo Go is updated to support the newer version, and this will be the only version of Expo Go available to install from the stores.
If you're developing on an Android Device, Android Emulator, or iOS Simulator, a compatible version of Expo Go can be [downloaded and installed](https://expo.dev/go). The only platform where this is impossible is iPhone devices because Apple does not support side-loading older versions of apps.
---


## Switch from Expo Go to a development build

How to switch from your Expo Go project to use development builds.

To switch from Expo Go to a development build, you'll need to follow the steps below:
Step 1: 
## Install the `expo-dev-client`
The Expo Dev Client library includes the launcher UI (shown in the screenshots below), dev menu, extensions to test over-the-air updates, and more. The Expo Go app has the dev menu built in, and that's why you need to install it separately for a development build.
```sh
$ npx expo install expo-dev-client
```
> We recommend using the `expo-dev-client` for the best development experience, but it is possible to use development builds without installing this library. If not using the dev client, in [Step 3](/develop/development-builds/expo-go-to-dev-build/#start-the-dev-client), start the bundler with `--dev-client`. Otherwise, it will default to opening in Expo Go.
Step 2: 
