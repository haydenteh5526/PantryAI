import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

type Extra = { SENTRY_DSN?: string };
const extra = (Constants.expoConfig?.extra ?? {}) as Extra;
const dsn = extra.SENTRY_DSN ?? process.env.SENTRY_DSN ?? "";

export function initSentry() {
  if (!dsn) return;

  Sentry.init({
    dsn,
    debug: __DEV__,
    enabled: !__DEV__,
    tracesSampleRate: 0.2,
  });
}

export { Sentry };
