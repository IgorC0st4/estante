import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './pages/Home';
import NovoLivro from './pages/Novo-Livro';
import EditarLivro from './pages/Editar-Livro';
import Resumo from './pages/Resumo';

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();

function HomeStackScreen() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Home" component={Home} />
            <HomeStack.Screen name="Novo Livro" component={NovoLivro} />
            <HomeStack.Screen name="Editar Livro" component={EditarLivro} />
        </HomeStack.Navigator>
    );
}

const ResumoStack = createStackNavigator();
function ResumoStackScreen(){
    return(
        <ResumoStack.Navigator>
            <ResumoStack.Screen name="Resumo" component={Resumo} />
        </ResumoStack.Navigator>
    );
}

export default function Routes() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Home') {
                            iconName = focused
                                ? 'home'
                                : 'home-outline';
                        } else if (route.name === 'Resumo') {
                            iconName = focused
                                ? 'calendar'
                                : 'calendar-outline';
                        }

                        return <Ionicons name={iconName} size={20} color={color} />;
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'tomato',
                    inactiveTintColor: 'gray'
                }}
            >

                <Tab.Screen name="Home" component={HomeStackScreen} />
                <Tab.Screen name="Resumo" component={ResumoStackScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}