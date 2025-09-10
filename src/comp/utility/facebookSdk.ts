let facebookSdkPromise: Promise<void> | null = null;

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB: {
      init: (config: {
        appId: string;
        cookie: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      AppEvents?: {
        logPageView?: () => void;
      };
    };
  }
}

export function ensureFacebookSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.FB) return Promise.resolve();
  if (facebookSdkPromise) return facebookSdkPromise;

  facebookSdkPromise = new Promise<void>((resolve) => {
    window.fbAsyncInit = function () {
      if (!window.FB) return resolve();
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
        cookie: true,
        xfbml: true,
        version: process.env.NEXT_PUBLIC_FACEBOOK_API_VERSION || "v19.0",
      });
      try {
        window.FB.AppEvents?.logPageView?.();
      } catch {}
      resolve();
    };

    const id = "facebook-jssdk";
    if (document.getElementById(id)) return resolve();
    const js = document.createElement("script");
    js.id = id;
    js.async = true;
    js.defer = true;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    const fjs = document.getElementsByTagName("script")[0];
    fjs.parentNode?.insertBefore(js, fjs);
  });

  return facebookSdkPromise;
}
