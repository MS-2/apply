import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { onlineManager } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native-paper";
import { ArticleCard } from "@/components/ArticlesCard";
import { ConnectionBanner } from "@/components/ConnextionBanner.tsx";
import { ScreenWrapper } from "@/components/ScreensWrapper";
import { useDeletedArticles } from "@/hooks/DeletedScreen";

const DeletedScreen: React.FC = () => {
  const { articles, loading, error, fetchDeletedArticles, removeFromDeleted } = useDeletedArticles();

  useFocusEffect(
    useCallback(() => {
      fetchDeletedArticles();
    }, [fetchDeletedArticles])
  );

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator animating size="large" />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {error && !onlineManager.isOnline() && (
        <ConnectionBanner online={onlineManager.isOnline()} />
      )}
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={articles}
        keyExtractor={({ objectID }) => objectID}
        renderItem={({ item, index }) => (
          <ArticleCard
            index={index}
            {...item}
            onSwipeRight={() => removeFromDeleted(item.objectID)}
          />
        )}
      />
    </ScreenWrapper>
  );
};

export default DeletedScreen;
