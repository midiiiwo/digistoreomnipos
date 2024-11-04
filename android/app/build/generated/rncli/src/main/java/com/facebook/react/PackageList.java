
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @baronha/react-native-multiple-image-picker
import com.reactnativemultipleimagepicker.MultipleImagePickerPackage;
// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/art
import com.reactnativecommunity.art.ARTPackage;
// @react-native-community/checkbox
import com.reactnativecommunity.checkbox.ReactCheckBoxPackage;
// @react-native-community/clipboard
import com.reactnativecommunity.clipboard.ClipboardPackage;
// @react-native-community/datetimepicker
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/netinfo
import com.reactnativecommunity.netinfo.NetInfoPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// @react-native-picker/picker
import com.reactnativecommunity.picker.RNCPickerPackage;
// @shopify/flash-list
import com.shopify.reactnative.flash_list.ReactNativeFlashListPackage;
// appcenter
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
// appcenter-analytics
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
// appcenter-crashes
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
// jail-monkey
import com.gantix.JailMonkey.JailMonkeyPackage;
// lottie-react-native
import com.airbnb.android.react.lottie.LottiePackage;
// react-native-action-sheet
import com.actionsheet.ActionSheetPackage;
// react-native-blob-util
import com.ReactNativeBlobUtil.ReactNativeBlobUtilPackage;
// react-native-camera
import org.reactnative.camera.RNCameraPackage;
// react-native-charts-wrapper
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
// react-native-code-push
import com.microsoft.codepush.react.CodePush;
// react-native-device-info
import com.learnium.RNDeviceInfo.RNDeviceInfo;
// react-native-document-picker
import com.reactnativedocumentpicker.DocumentPickerPackage;
// react-native-exit-app
import com.github.wumke.RNExitApp.RNExitAppPackage;
// react-native-fast-image
import com.dylanvann.fastimage.FastImageViewPackage;
// react-native-fast-shadow
import com.reactnativefastshadow.FastShadowPackage;
// react-native-file-viewer
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-html-to-pdf
import com.christopherdro.htmltopdf.RNHTMLtoPDFPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-keychain
import com.oblador.keychain.KeychainPackage;
// react-native-linear-gradient
import com.BV.LinearGradient.LinearGradientPackage;
// react-native-pager-view
import com.reactnativepagerview.PagerViewPackage;
// react-native-pdf
import org.wonday.pdf.RCTPdfView;
// react-native-permissions
import com.zoontek.rnpermissions.RNPermissionsPackage;
// react-native-push-notification
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-select-contact
import com.streem.selectcontact.SelectContactPackage;
// react-native-share
import cl.json.RNSharePackage;
// react-native-shared-element
import com.ijzerenhein.sharedelement.RNSharedElementPackage;
// react-native-simple-crypto
import com.pedrouid.crypto.RNSCCryptoPackage;
// react-native-sound-player
import com.johnsonsu.rnsoundplayer.RNSoundPlayerPackage;
// react-native-spinkit
import com.react.rnspinkit.RNSpinkitPackage;
// react-native-splash-screen
import org.devio.rn.splashscreen.SplashScreenReactPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-ui-lib
import com.wix.reactnativeuilib.highlighterview.HighlighterViewPackage;
import com.wix.reactnativeuilib.keyboardinput.KeyboardInputPackage;
import com.wix.reactnativeuilib.textinput.TextInputDelKeyHandlerPackage;
import com.wix.reactnativeuilib.wheelpicker.WheelPickerPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-version-check
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;
// react-native-view-shot
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;
// sp-react-native-in-app-updates
import com.sudoplz.rninappupdates.SpReactNativeInAppUpdatesPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new MultipleImagePickerPackage(),
      new AsyncStoragePackage(),
      new ARTPackage(),
      new ReactCheckBoxPackage(),
      new ClipboardPackage(),
      new RNDateTimePickerPackage(),
      new GeolocationPackage(),
      new NetInfoPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new RNCPickerPackage(),
      new ReactNativeFlashListPackage(),
      new AppCenterReactNativePackage(getApplication()),
      new AppCenterReactNativeAnalyticsPackage(getApplication(), getResources().getString(com.ipayghpostablet.R.string.appCenterAnalytics_whenToEnableAnalytics)),
      new AppCenterReactNativeCrashesPackage(getApplication(), getResources().getString(com.ipayghpostablet.R.string.appCenterCrashes_whenToSendCrashes)),
      new JailMonkeyPackage(),
      new LottiePackage(),
      new ActionSheetPackage(),
      new ReactNativeBlobUtilPackage(),
      new RNCameraPackage(),
      new MPAndroidChartPackage(),
      new CodePush(getResources().getString(com.ipayghpostablet.R.string.CodePushDeploymentKey), getApplicationContext(), com.ipayghpostablet.BuildConfig.DEBUG),
      new RNDeviceInfo(),
      new DocumentPickerPackage(),
      new RNExitAppPackage(),
      new FastImageViewPackage(),
      new FastShadowPackage(),
      new RNFileViewerPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new RNHTMLtoPDFPackage(),
      new ImagePickerPackage(),
      new KeychainPackage(),
      new LinearGradientPackage(),
      new PagerViewPackage(),
      new RCTPdfView(),
      new RNPermissionsPackage(),
      new ReactNativePushNotificationPackage(),
      new ReanimatedPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new SelectContactPackage(),
      new RNSharePackage(),
      new RNSharedElementPackage(),
      new RNSCCryptoPackage(),
      new RNSoundPlayerPackage(),
      new RNSpinkitPackage(),
      new SplashScreenReactPackage(),
      new SvgPackage(),
      new HighlighterViewPackage(),
      new WheelPickerPackage(),
      new TextInputDelKeyHandlerPackage(),
      new KeyboardInputPackage(getApplication()),
      new VectorIconsPackage(),
      new RNVersionCheckPackage(),
      new RNViewShotPackage(),
      new RNCWebViewPackage(),
      new SpReactNativeInAppUpdatesPackage()
    ));
  }
}
