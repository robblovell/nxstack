import { User } from './types';
export interface Authenticator {
    isAuthProvider(user: User): boolean;
    applyAuthentication(user: User, opts: any): Promise<void>;
}
