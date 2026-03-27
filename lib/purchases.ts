// ============================================================
// PURCHASES SERVICE — RevenueCat Integration (Prep)
// ============================================================
// Install: npx expo install react-native-purchases
// Docs: https://docs.revenuecat.com/docs/reactnative
//
// This is a placeholder structure. Replace REVENUECAT_API_KEY
// with your real key when ready.
// ============================================================

import { Platform } from "react-native";

const REVENUECAT_API_KEY_IOS = "appl_PLACEHOLDER_IOS_KEY";
const REVENUECAT_API_KEY_ANDROID = "goog_PLACEHOLDER_ANDROID_KEY";

// Iron3 entitlement identifier in RevenueCat
const PREMIUM_ENTITLEMENT = "iron3_premium";

export interface PurchaseOffering {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  product: string;
}

export interface PurchaseResult {
  success: boolean;
  error?: string;
  isPremium?: boolean;
}

let isInitialized = false;

/**
 * Initialize RevenueCat SDK.
 * Call once at app startup (after auth, so we can identify the user).
 */
export async function initializePurchases(userId?: string): Promise<void> {
  if (isInitialized) return;

  try {
    // When react-native-purchases is installed, uncomment:
    // const Purchases = require("react-native-purchases").default;
    // const apiKey = Platform.OS === "ios" ? REVENUECAT_API_KEY_IOS : REVENUECAT_API_KEY_ANDROID;
    // await Purchases.configure({ apiKey, appUserID: userId });
    // isInitialized = true;

    console.log("[Purchases] RevenueCat init stub — install react-native-purchases to activate");
    isInitialized = true;
  } catch (err) {
    console.error("[Purchases] Init failed:", err);
  }
}

/**
 * Get available subscription offerings.
 */
export async function getOfferings(): Promise<PurchaseOffering[]> {
  try {
    // const Purchases = require("react-native-purchases").default;
    // const offerings = await Purchases.getOfferings();
    // if (!offerings.current) return [];
    // return offerings.current.availablePackages.map((pkg) => ({
    //   identifier: pkg.identifier,
    //   title: pkg.product.title,
    //   description: pkg.product.description,
    //   priceString: pkg.product.priceString,
    //   product: pkg.product.identifier,
    // }));

    // Stub return for development
    return [
      {
        identifier: "$rc_weekly",
        title: "Iron3 Premium Weekly",
        description: "Full access to all features",
        priceString: "$4.99/week",
        product: "iron3_premium_weekly",
      },
    ];
  } catch (err) {
    console.error("[Purchases] getOfferings failed:", err);
    return [];
  }
}

/**
 * Purchase a package by identifier.
 */
export async function purchasePackage(
  packageIdentifier: string
): Promise<PurchaseResult> {
  try {
    // const Purchases = require("react-native-purchases").default;
    // const offerings = await Purchases.getOfferings();
    // const pkg = offerings.current?.availablePackages.find(
    //   (p) => p.identifier === packageIdentifier
    // );
    // if (!pkg) return { success: false, error: "Package not found" };
    // const { customerInfo } = await Purchases.purchasePackage(pkg);
    // const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
    // return { success: true, isPremium };

    console.log("[Purchases] Purchase stub for:", packageIdentifier);
    return { success: false, error: "RevenueCat not configured yet" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Purchase failed";
    return { success: false, error: message };
  }
}

/**
 * Restore previous purchases (e.g. after reinstall).
 */
export async function restorePurchases(): Promise<PurchaseResult> {
  try {
    // const Purchases = require("react-native-purchases").default;
    // const { customerInfo } = await Purchases.restorePurchases();
    // const isPremium = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;
    // return { success: true, isPremium };

    console.log("[Purchases] Restore stub");
    return { success: false, error: "RevenueCat not configured yet" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Restore failed";
    return { success: false, error: message };
  }
}

/**
 * Check if the current user has an active premium subscription.
 */
export async function checkSubscription(): Promise<boolean> {
  try {
    // const Purchases = require("react-native-purchases").default;
    // const customerInfo = await Purchases.getCustomerInfo();
    // return customerInfo.entitlements.active[PREMIUM_ENTITLEMENT] !== undefined;

    return false; // stub
  } catch {
    return false;
  }
}
