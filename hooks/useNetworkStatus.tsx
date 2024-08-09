import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? false);
            console.log('Network status changed:', state.isConnected);
        });

        // Check initial connection status
        NetInfo.fetch().then((state: { isConnected: any }) => {
            setIsConnected(state.isConnected ?? false);
            console.log('Initial network status:', state.isConnected);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return isConnected;
};

export default useNetworkStatus;
