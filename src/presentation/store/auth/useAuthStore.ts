import { create } from "zustand";
import { User } from "../../../domain/entities/user.entity";
import { AuthStatus } from "../../../infrastructure/interfaces/auth.status";
import { authCheckingStatus, authLogin } from "../../../actions";
import { StorageAdapter } from "../../../config/adapter/async-storage";


export interface AuthState {
    status: AuthStatus
    token?: string;
    user?: User;

    login: (email: string, password: string ) => Promise<boolean>;
    checkStatus: () => Promise<void>;
    logout: () => Promise<void>;

}



export const useAuthStore = create<AuthState>()( (set, get) => ({
    status: 'checking',
    token: undefined,
    user: undefined,


    login: async( email: string, password: string ) => {
        const resp = await authLogin(email, password);
        if( !resp ) {
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return false;
        }

        // TODO: save token and user in storage
        await StorageAdapter.setItem('token', resp.token);
        
        set({ status: 'authenticated', user: resp.user, token: resp.token});

        return true;
    },
    
    checkStatus: async() => {
        const resp = await authCheckingStatus();
        if( !resp ) {
            set({ status: 'unauthenticated', token: undefined, user: undefined });
            return;
        }

        await StorageAdapter.setItem('token', resp.token);
        
        set({ status: 'authenticated', user: resp.user, token: resp.token});

    },

    logout: async() => {
        await StorageAdapter.removeItem('token');
        set({ status: 'unauthenticated', token: undefined, user: undefined });
        return;
    }
    


}))