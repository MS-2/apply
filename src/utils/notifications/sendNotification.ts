import * as Notifications from "expo-notifications";
import { Hit } from "@/types/algoliaResponse";
import { Linking } from "react-native";
import { filterHitsByPreferences } from "../utilitys";

export const sanitizeResponse = (hits: Hit[]) => {
  const seenStoryTitles = new Set<string>();
  return hits.filter((hit) => {
    const normalizedTitle = hit.story_title?.trim().toLowerCase();
    if (normalizedTitle && !seenStoryTitles.has(normalizedTitle)) {
      seenStoryTitles.add(normalizedTitle);
      return true;
    }
    return false;
  });
};

type SendNotificationParams = {
  hits: Hit[];
  selectedPreferences: string[];
};

export const sendNotification = async ({
  hits,
  selectedPreferences,
}: SendNotificationParams): Promise<void> => {
  if (!hits || !Array.isArray(selectedPreferences)) {
    console.error("Invalid arguments passed to sendNotification");
    return;
  }

  try {
    const matchedHits = filterHitsByPreferences(hits, selectedPreferences);

    for (const hit of matchedHits) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: hit.story_title,
          body: "This article matches your interests!",
          data: { url: hit.story_url }, // Incluye la URL en los datos
        },
        trigger: null, // Envía la notificación de inmediato
      });

      // Agrega un pequeño retraso entre cada notificación
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Retraso de 500 ms entre notificaciones
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};
// Listener para manejar la respuesta a la notificación
Notifications.addNotificationResponseReceivedListener((response) => {
  const url = response.notification.request.content.data?.url;

  if (url) {
    Linking.openURL(url); // Abre la URL cuando se hace clic en la notificación
  }
});
