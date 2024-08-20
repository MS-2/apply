import React, { ReactNode, useState } from 'react';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeAction } from './SwipeAction';

type SwipeableItemProps = {
  children: ReactNode;
  onSwipeRight?: (objectID: string) => Promise<void>;
  onSwipeLeft?: (objectID: string) => Promise<void>;
  objectID: string
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onSwipeLeft, onSwipeRight, objectID }) => {
  const [isSwipeOut, setIsSwipeOut] = useState(false);
  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    setIsSwipeOut(true);
    const action = direction === 'left' ? onSwipeRight : onSwipeLeft;
    if (action) action(objectID);
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderRightActions={onSwipeLeft && (() => <SwipeAction color='#a81212b4' isSwipeOut={isSwipeOut} />)}
        renderLeftActions={onSwipeRight && (() => <SwipeAction color='#bfff0094' isSwipeOut={isSwipeOut} />)}
        onSwipeableOpen={handleSwipeableOpen}
        overshootRight={false}
        overshootLeft={false}
        friction={0.1}  // soft swipe
        overshootFriction={0.1}  // reduce bounce resist
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
};

