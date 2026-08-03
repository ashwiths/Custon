export type NotificationLevel = "action" | "critical" | "info" | "all";

export function shouldShowNotification(level: NotificationLevel): boolean {
  try {
    const pref = localStorage.getItem("startup_notification_pref") || "action";
    if (pref === "mute") return false;
    if (pref === "all") return true;
    if (pref === "critical") return level === "critical";
    if (pref === "action") return level === "action" || level === "critical";
    return true;
  } catch {
    return true;
  }
}
