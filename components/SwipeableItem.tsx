import React, { ReactNode, useState, useRef } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

type SwipeableItemProps = {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onSwipeLeft, onSwipeRight }) => {
  const [actionState, setActionState] = useState<'idle' | 'dragging'>('idle');

  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    setActionState('idle');
    if (direction === 'left') {
      onSwipeRight();
    } else if (direction === 'right') {
      onSwipeLeft();
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
