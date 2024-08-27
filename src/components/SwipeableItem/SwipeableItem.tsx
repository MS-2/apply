import React, { ReactNode, useRef, useState } from 'react';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeAction } from '../SwipeAction';
import { router } from 'expo-router';

type SwipeableItemProps = {
  children: ReactNode;
  onSwipeLeft?: () => Promise<void>;
  onSwipeRight?: () => Promise<void>;
}

export const SwipeableItem: React.FC<SwipeableItemProps> = ({ children, onSwipeLeft, onSwipeRight }) => {
  const [isSwipeOut, setIsSwipeOut] = useState(false);
  const swipeableRef = useRef<Swipeable>(null)

  const handleSwipeableOpen = (direction: 'left' | 'right') => {
    setIsSwipeOut(true);
    if (direction === 'right' && onSwipeLeft && swipeableRef.current) {
      router.push('/screens/loader')
      onSwipeLeft()
      swipeableRef.current.close();
    } else if (direction === 'left' && onSwipeRight && swipeableRef.current) {
      router.push('/screens/loader')
      onSwipeRight()
      swipeableRef.current.close();
    }
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        renderRightActions={onSwipeLeft && (() => <SwipeAction color='#a81212b4' isSwipeOut={isSwipeOut} />)}
        renderLeftActions={onSwipeRight && (() => <SwipeAction color='#bfff0094' isSwipeOut={isSwipeOut} />)}
        onSwipeableOpen={(direction) => handleSwipeableOpen(direction)}
        onSwipeableWillOpen={() => setIsSwipeOut(true)}
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

