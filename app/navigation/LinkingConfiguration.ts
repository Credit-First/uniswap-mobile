/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */
import * as Linking from 'expo-linking';
import { LinkingOptions } from '@react-navigation/native';

import { RootStackParamList } from '../types';
import ROUTES from './routes';

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [Linking.createURL('/'), 'https://iguverse.com/'],
    config: {
        screens: {
            [ROUTES.SOCIALIZE_TO_EARN_VERIFY_USER]: 'app/verify-user/:petId',
            [ROUTES.PLAY]: '*',
        },
    },
};

export default linking;
