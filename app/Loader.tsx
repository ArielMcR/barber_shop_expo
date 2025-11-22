import React from 'react'
import { ActivityIndicator, Image, Text, View } from 'react-native'
import logo from "../assets/images/LogoAri.jpg"
function Loader() {
    return (
        <View className="flex-1 items-center justify-center bg-white gap-10">
            <Image source={logo} className="w-40 h-40 rounded-full object-contain" />
            <ActivityIndicator size={50} color="#34302D" />
            <Text>Carregando...</Text>
        </View>
    )
}

export default Loader