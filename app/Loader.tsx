import { Cores } from '@/constants/design'
import React from 'react'
import { ActivityIndicator, Image, Text, View } from 'react-native'
import logo from "../assets/images/LogoAri.jpg"

function Loader() {
    return (
        <View className="flex-1 items-center justify-center bg-canvas gap-8">
            <Image source={logo} className="w-32 h-32 rounded-full" />
            <ActivityIndicator size="large" color={Cores.brand} />
            <Text className="font-display text-[12px] tracking-[2px] text-ink-muted">CARREGANDO</Text>
        </View>
    )
}

export default Loader
