import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';

type SwipeableItemProps = {
  children: ReactNode;
  onDelete: () => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onDelete }) => {
  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
      <FontAwesome name="trash" size={24} color="white" />
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        friction={2}
        overshootRight={false}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default SwipeableItem;
