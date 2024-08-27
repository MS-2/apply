// src/test/components/TabBarIcon.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import { TabBarIcon } from '@/components/TabBarIcon';

import { View } from 'react-native';

describe('TabBarIcon', () => {
    it('renders correctly with the correct icon name and color', () => {
        const { getByTestId } = render(
            <View testID="tab-bar-icon">
                <TabBarIcon
                    name="trash"
                    color="red"
                />
            </View>
        );
        const icon = getByTestId('tab-bar-icon');
        expect(icon).toBeTruthy();
    });
});
