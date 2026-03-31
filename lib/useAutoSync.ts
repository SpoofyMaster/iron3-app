import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import { useAppStore } from "@/store/useAppStore";
import { syncHealthWorkouts } from "./healthSync";

const SYNC_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Hook that auto-syncs Apple Health workouts when:
 * 1. App comes to foreground
 * 2. User is authenticated
 * 3. Apple Health is connected
 * 4. Last sync was more than 15 min ago
 */
export function useAutoSync() {
  const lastSyncRef = useRef<number>(0);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const connectedDevices = useAppStore((s) => s.connectedDevices);
  const isAppleHealthConnected = connectedDevices.find(
    (d) => d.type === "apple_health" && d.isConnected
  );

  useEffect(() => {
    if (Platform.OS !== "ios" || !currentUserId || !isAppleHealthConnected) return;

    const doSync = async () => {
      const now = Date.now();
      if (now - lastSyncRef.current < SYNC_INTERVAL_MS) return;
      
      lastSyncRef.current = now;
      try {
        const result = await syncHealthWorkouts(currentUserId, 7);
        if (result.synced > 0) {
          console.log(`Auto-sync: imported ${result.synced} new workouts`);
          const store = useAppStore.getState();
          // Re-hydrate persisted data so all derived stats stay in sync.
          await store.hydrateUserData(currentUserId);
        }
      } catch (e) {
        console.error("Auto-sync failed:", e);
      }
    };

    // Sync on mount
    doSync();

    // Sync when app comes back to foreground
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        doSync();
      }
    });

    return () => subscription.remove();
  }, [currentUserId, isAppleHealthConnected]);
}
