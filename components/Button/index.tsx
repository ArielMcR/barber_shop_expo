import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const buttonTypes = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    danger: "bg-red-500 text-white"
}


type ButtonProps = {
    onPress: () => void;
    title: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
};

function Button({ onPress, title, className, icon, ...rest }: ButtonProps) {
    return (
        <TouchableOpacity onPress={onPress} className={`bg-blue-500 text-white p-2 rounded-xl w-40 h-16 justify-center ${className}`} {...rest}>
            <View className="flex-row items-center justify-center gap-3">
                <Text className='text-center text-2xl text-white'>{title}</Text>
                {icon ? icon : null}
            </View>
        </TouchableOpacity>
    )
}

export default Button