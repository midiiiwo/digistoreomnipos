package com.ipayghpostablet;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.wix.reactnativeuilib.UiLibPackageList;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.soloader.SoLoader;
import com.ipayghpostablet.Printer.DemoApp;
import com.ipayghpostablet.PrinterPackage;
import com.ipayghpostablet.newarchitecture.MainApplicationReactNativeHost;
import com.pax.dal.IDAL;
import com.pax.neptunelite.api.NeptuneLiteUser;
import com.microsoft.codepush.react.CodePush;

import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private static IDAL dal;
    private static DemoApp mDemoApp;
    private static MainApplication instance;

  private final ReactNativeHost mReactNativeHost =
      new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // packages.addAll(new UiLibPackageList(MainApplication.this).getPackageList());
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
            packages.add(new PrinterPackage());
          //  packages.add(new SplashScreenReactPackage());
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
        
        @Override
        protected String getJSBundleFile() {
          return CodePush.getJSBundleFile();
        }
      };

  private final ReactNativeHost mNewArchitectureNativeHost =
      new MainApplicationReactNativeHost(this);

  @Override
  public ReactNativeHost getReactNativeHost() {
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      return mNewArchitectureNativeHost;
    } else {
      return mReactNativeHost;
    }
  }

  @Override
  public void onCreate() {
    super.onCreate();
    // If you opted-in for the New Architecture, we enable the TurboModule system
    ReactFeatureFlags.useTurboModules = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;

    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
    instance = this;
  }

    public static IDAL getDal(){

        if(dal == null){
            try {
                long start = System.currentTimeMillis();
                dal = NeptuneLiteUser.getInstance().getDal(instance);
                Log.i("Test","get dal cost:"+(System.currentTimeMillis() - start)+" ms");
            } catch (Exception e) {
                e.printStackTrace();
                //Toast.makeText(appContext, "error occurred,DAL is null.", Toast.LENGTH_LONG).show();
            }
        }
        return dal;

    }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */



  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("com.ipayghpostablet.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
