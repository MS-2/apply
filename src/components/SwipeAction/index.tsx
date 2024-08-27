import React, { useRef, useEffect, useCallback } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';

type SwipeActionProps = {
    color: string;
    isSwipeOut?: boolean;
};

export const SwipeAction: React.FC<SwipeActionProps> = ({ color, isSwipeOut = false }) => {
    const animRef = useRef<Animatable.View & ViewStyle>(null);

    const handleSwipeOut = useCallback(() => {
        if (isSwipeOut && animRef.current) {
            animRef.current.transitionTo({ opacity: 0 });
        }
    }, [isSwipeOut]);

    useEffect(() => {
        handleSwipeOut();
    }, [handleSwipeOut]);

    return (
        <Animatable.View
            ref={animRef}
            animation="fadeIn"
            duration={500}
            easing="ease-in-out"
            style={[styles.actionContainer, { backgroundColor: color }]}
        />
    );
};

const styles = StyleSheet.create({
    actionContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
