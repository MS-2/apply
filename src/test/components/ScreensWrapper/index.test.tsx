import * as React from "react";
import { render } from '@testing-library/react-native';
import { ThemeProvider, Text } from 'react-native-paper';

import { ScreenWrapper } from '@/components/ScreensWrapper';

// Mock the useHeaderHeight hook
jest.mock('@react-navigation/elements', () => ({
    useHeaderHeight: () => 100, // Mock header height value
}));

describe('ScreenWrapper', () => {
    it('renders correctly with children', () => {
        const { getByText } = render(
            <ThemeProvider>

                <ScreenWrapper>
                    <Text>Test Child</Text>
                </ScreenWrapper>

            </ThemeProvider>
        );

        // Check if the child text is present
        const childText = getByText('Test Child');
        expect(childText).toBeTruthy();
    });
});
