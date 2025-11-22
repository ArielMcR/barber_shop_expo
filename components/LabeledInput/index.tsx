import { View, Text, TextInput } from 'react-native'
import React from 'react'

type LabeledInputProps = {
    label: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    className?: string;
};
const index = ({ label, onChangeText, className, placeholder, ...rest }: LabeledInputProps) => {
    return (
        <View className={`flex-col`}>
            <Text className='text-1xl '>{label}</Text>
            <TextInput
                onChangeText={onChangeText}
                placeholder={placeholder}
                {...rest}
                className={className}
                allowFontScaling={false}
            />
        </View>
    )
}

export default index