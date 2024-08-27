import { useState } from "react";
import { clearAllLocalData } from "./data";

export const useSettings = () => {
  const [visible, setVisible] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: "" });

  const showSnackbar = (message: string) =>
    setSnackbar({ visible: true, message });
  const hideSnackbar = () => setSnackbar({ visible: false, message: "" });

  const toggleDialog = () => setVisible((prev) => !prev);

  const confirmClearLocalData = async () => {
    toggleDialog();
    try {
      await clearAllLocalData();
      showSnackbar("Local data has been cleared!");
    } catch {
      showSnackbar("Error clearing local data");
    }
  };

  return {
    visible,
    snackbar,
    showSnackbar,
    hideSnackbar,
    toggleDialog,
    confirmClearLocalData,
  };
};
