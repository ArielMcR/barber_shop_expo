import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScreenWrapperProps = {
    children: ReactNode;
    className?: string;
    withTopInset?: boolean;
    withBottomInset?: boolean;
    topOffset?: number;
    bottomOffset?: number;
    style?: ViewStyle;
};

export default function ScreenWrapper({
    children,
    className = 'flex-1 bg-gray-50',
    withTopInset = true,
    withBottomInset = false,
    topOffset = 0,
    bottomOffset = 0,
    style,
}: ScreenWrapperProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            className={className}
            style={[
                {
                    paddingTop: withTopInset ? insets.top + topOffset : topOffset,
                    paddingBottom: withBottomInset ? insets.bottom + bottomOffset : bottomOffset,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

export function useInsets() {
    return useSafeAreaInsets();
}
