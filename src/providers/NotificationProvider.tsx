import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { registerForPushNotificationsAsync } from "@/utils/notifications/notifications";

const NotificationContext = createContext({} as any);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] =
    useState<Notifications.Notification>();

  useEffect(() => {
    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) setExpoPushToken(token);

      if (Platform.OS === "android") {
        setChannels(await Notifications.getNotificationChannelsAsync());
      }

      Notifications.addNotificationReceivedListener(setNotification);
      Notifications.addNotificationResponseReceivedListener((response) =>
        console.log(response)
      );
    };

    setupNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, channels, notification, setNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
