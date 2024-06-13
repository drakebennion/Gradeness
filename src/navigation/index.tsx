import { useAuthentication } from '../utils/hooks/useAuthentication';
import AuthStack from './authStack';
import UserStack from './userStack';

export default function RootNavigation() {
  const { user, isOwner } = useAuthentication();

  if (!user) {
    return <AuthStack />;
  }

  return isOwner ? <UserStack /> : <UserStack />;
}
