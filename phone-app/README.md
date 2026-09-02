# Golf Canada Companion App

React Native phone application for bridging Garmin Connect IQ watch data with Golf Canada APIs.

## Contribution

### Prerequisites

- Node.js 18+
- Java JDK 17+
- Android Studio (SDK + emulator)
- Garmin Connect IQ SDK + Connect IQ Device Simulator
- VS Code extensions:
  - `garmin.monkey-c`
  - `msjsdiag.vscode-react-native`
  - `dbaeumer.vscode-eslint`
- React Native Paper theming is used for shared app styling and dark/light mode support.

### Setup

1. Open the repository root in VS Code.
2. Install phone dependencies:

   ```bash
   cd phone-app
   npm install
   ```

3. Ensure Android emulator and Connect IQ simulator are installed and runnable.

### Run in VS Code simulators

1. Start an Android emulator in Android Studio Device Manager.
2. Start the Connect IQ Device Simulator and select a supported device profile (`fenix7`, `epix2`, or `forerunner965`).
3. In VS Code, open **Run and Debug**.
4. Select **Launch Garmin Watch App** to build/deploy the watch app from `garmin-watch/monkey.jungle`.
5. Select **Launch React Native App** to run the phone app in the Android emulator.

### Useful commands

From `phone-app/`:

```bash
npm run start
npm run android
```
