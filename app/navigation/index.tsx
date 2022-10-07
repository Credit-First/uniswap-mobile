/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as React from 'react';
import {
    DarkTheme,
    DefaultTheme,
    NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';
import { ColorSchemeName } from 'react-native';

import { AppStateContext, State } from '../contexts/AppStateContext';
import { useLottieAssets } from '../contexts/LottieAssetsContext';
import { useUser } from '../contexts/UserContext';
import SplashScreen from '../screens/AppState/SplashScreen';
import UpdateRequiredScreen from '../screens/AppState/UpdateRequiredScreen';
import DevScreen from '../screens/Dev/DevScreen';
import EnterReferralCodeScreen from '../screens/EnterReferralCodeScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ROUTES from './routes';
import AdminStack from './stacks/AdminStack';
import BottomTabBar from './stacks/BottomTabBar/BottomTabBar';
import CharityGroup from './stacks/CharityGroup';
import CollectionGroup from './stacks/CollectionGroup';
import CreateWalletGroup from './stacks/CreateWalletGroup';
import MintStack from './stacks/MintStack';
import MoveToEarnGroup from './stacks/MoveToEarnGroup';
import PlayGroup from './stacks/PlayGroup';
import PlayToEarnGroup from './stacks/PlayToEarnGroup';
import ProfileStack from './stacks/ProfileStack';
import SocializeToEarnGroup from './stacks/SocializeToEarnGroup';
import WalletGroup from './stacks/WalletGroup';

interface INavigationProps {
    colorScheme: ColorSchemeName;
    isLoadingComplete: boolean;
}

export default function Navigation({
    colorScheme,
    isLoadingComplete,
}: INavigationProps) {
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <RootNavigator isLoadingComplete={isLoadingComplete} />
        </NavigationContainer>
    );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const RootStack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator({ isLoadingComplete }: { isLoadingComplete: boolean }) {
    const { isLoaded } = useLottieAssets();
    const { hasRole } = useUser();

    if (!isLoadingComplete && isLoaded) {
        return <SplashScreen />;
    }

    const { state } = useContext(AppStateContext);
    switch (state) {
        case State.loggedInWallet:
            return (
                <RootStack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <RootStack.Screen
                        name={ROUTES.BOTTOM_TAB_ROOT}
                        component={BottomTabBar}
                    />

                    {WalletGroup(RootStack)}

                    <RootStack.Screen
                        name={ROUTES.PROFILE_ROOT}
                        component={ProfileStack}
                    />

                    <RootStack.Screen
                        name={ROUTES.MINT_ROOT}
                        component={MintStack}
                        options={{ gestureEnabled: false }}
                    />

                    {hasRole() && (
                        <RootStack.Screen
                            name={ROUTES.ADMIN_ROOT}
                            component={AdminStack}
                        />
                    )}

                    <RootStack.Group
                        screenOptions={{
                            headerShown: false,
                        }}>
                        {CharityGroup(RootStack)}
                    </RootStack.Group>

                    <RootStack.Group
                        screenOptions={{
                            headerShown: false,
                        }}>
                        {CollectionGroup(RootStack)}
                    </RootStack.Group>

                    <RootStack.Group
                        screenOptions={{
                            headerShown: false,
                        }}>
                        {PlayGroup(RootStack)}
                    </RootStack.Group>

                    <RootStack.Group
                        screenOptions={{
                            headerShown: false,
                        }}>
                        {SocializeToEarnGroup(RootStack)}
                    </RootStack.Group>

                    <RootStack.Group
                        screenOptions={{
                            headerShown: false,
                        }}>
                        {MoveToEarnGroup(RootStack)}
                    </RootStack.Group>

                    <RootStack.Group
                        screenOptions={{
                            headerShown: false,
                        }}>
                        {PlayToEarnGroup(RootStack)}
                    </RootStack.Group>

                    <RootStack.Screen
                        name={ROUTES.DEV}
                        options={{ gestureEnabled: false }}
                        component={DevScreen}
                    />
                    <RootStack.Screen
                        name={ROUTES.ENTER_REFERRAL_CODE}
                        component={EnterReferralCodeScreen}
                        options={{ presentation: 'modal' }}
                    />
                </RootStack.Navigator>
            );
        case State.loggedInNoWallet:
            return (
                <RootStack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <RootStack.Group
                        screenOptions={{
                            headerShown: false,
                        }}>
                        {CreateWalletGroup(RootStack)}
                    </RootStack.Group>
                </RootStack.Navigator>
            );
        case State.notLoggedIn:
            return (
                <RootStack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <RootStack.Screen
                        name={ROUTES.LOGIN}
                        component={LoginScreen}
                    />
                </RootStack.Navigator>
            );
        // splash screen
        case State.initial:
            return <SplashScreen />;
        case State.updateRequired:
            return (
                <RootStack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <RootStack.Screen
                        name={ROUTES.DEV}
                        component={UpdateRequiredScreen}
                    />
                </RootStack.Navigator>
            );
    }
}
