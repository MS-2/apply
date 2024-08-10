import React, { ReactNode, useState, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

type SwipeableItemProps = {
  children: ReactNode;
  onDelete: () => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onDelete }) => {
  const [actionState, setActionState] = useState<'idle' | 'dragging'>('idle');

  const handleOnDrag = () => {
    setActionState('dragging');

  };

  const handleOnEnd = () => {
    setTimeout(() => {
      setActionState('idle');
      onDelete(); // Call the onDelete function after the action is completed
    }, 300); // Adjust the timeout as needed to match the animation duration
  };

  const renderRightActions = () => {
    let backgroundColor: string;
    let text: string;

    switch (actionState) {

      case 'dragging':
        backgroundColor = 'red';
        text = 'deleted';
        break;

      default:
        backgroundColor = 'orange';
        text = 'borrando';
    }

    return (
      <View style={{ width: '100%', backgroundColor, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>{text}</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={handleOnDrag}
        onSwipeableClose={handleOnEnd}
        overshootRight={false}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default SwipeableItem;
