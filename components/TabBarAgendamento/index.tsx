// components/TabBar.tsx
import React, { useState } from "react";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

interface TabBarProps {
    days: string[];
    renderScene: (day: string) => React.ReactNode;
}

export default function CustomTabBar({ days, renderScene }: TabBarProps) {
    const [index, setIndex] = useState(0);
    const [routes] = useState(
        days.map((day) => ({ key: day, title: day }))
    );

    const renderSceneMap = () =>
        Object.fromEntries(days.map((day) => [day, () => renderScene(day)]));

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={SceneMap(renderSceneMap())}
            onIndexChange={setIndex}
            initialLayout={{ width: 400 }} // Ajuste conforme necessário
            renderTabBar={(props) => (
                <TabBar
                    {...props}
                    indicatorStyle={{ backgroundColor: 'gree' }}
                    style={{ backgroundColor: 'white' }}
                    activeColor="black"
                    inactiveColor="gray"
                />
            )}
        />
    );
}