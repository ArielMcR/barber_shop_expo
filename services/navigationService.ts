import { router } from 'expo-router';

class NavigationService {
    navigate(route: any) {
        router.push(route);
    }

    replace(route: any) {
        router.replace(route);
    }

    back() {
        router.back();
    }

    canGoBack() {
        return router.canGoBack();
    }
}

export default new NavigationService();
