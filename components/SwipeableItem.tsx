import React, { ReactNode, useState, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

type SwipeableItemProps = {
  children: ReactNode;
  onDelete: () => void;
  onSwipeRight: () => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onDelete, onSwipeRight }) => {
  const [actionState, setActionState] = useState<'idle' | 'dragging'>('idle');

  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    setActionState('idle');
    if (direction === 'left') {
      onSwipeRight(); // Trigger onSwipeRight when swiped left
    } else if (direction === 'right') {
      onDelete(); // Trigger onDelete when swiped right
    }
  };
  const handleOnDrag = () => {
    setActionState('dragging');

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

  const renderLeftActions = () => {


    return (
      <View style={{ width: '100%', backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white' }}>favorites</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        onSwipeableWillOpen={handleOnDrag}
        onSwipeableOpen={handleSwipeableOpen}
        overshootRight={false}
        overshootLeft={false}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default SwipeableItem;
