import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import { useAppStore } from "@/store/useAppStore";
import { syncHealthWorkouts } from "./healthSync";

const MIN_INTERVAL_MS = 60 * 1000;
const BACKGROUND_POLL_MS = 15 * 60 * 1000;

/**
 * Auto-sync Apple Health: on open/foreground (throttled to 1/min) + every 15 min while active.
 */
export function useAutoSync() {
  const lastSyncRef = useRef<number>(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentUserId = useAppStore((s) => s.currentUserId);
  const connectedDevices = useAppStore((s) => s.connectedDevices);
  const isAppleHealthConnected = connectedDevices.find(
    (d) => d.type === "apple_health" && d.isConnected
  );

  useEffect(() => {
    if (Platform.OS !== "ios" || !currentUserId || !isAppleHealthConnected) return;

    const doSync = async (force: boolean) => {
      const now = Date.now();
      if (!force && now - lastSyncRef.current < MIN_INTERVAL_MS) return;

      lastSyncRef.current = now;
      try {
        const store = useAppStore.getState();
        const result = await syncHealthWorkouts(currentUserId, 7, {
          prepPlan: store.prepPlan,
        });
        if (result.synced > 0) {
          console.log(`Auto-sync: imported ${result.synced} new workouts`);
          await store.hydrateUserData(currentUserId);
        }
      } catch (e) {
        console.error("Auto-sync failed:", e);
      }
    };

    void doSync(true);

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") void doSync(true);
    });

    pollRef.current = setInterval(() => {
      if (AppState.currentState === "active") void doSync(false);
    }, BACKGROUND_POLL_MS);

    return () => {
      sub.remove();
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [currentUserId, isAppleHealthConnected]);
}
