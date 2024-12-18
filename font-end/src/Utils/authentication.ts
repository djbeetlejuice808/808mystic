// utils/auth.ts
import { jwtDecode } from 'jwt-decode';

export enum UserType {
    SELLER = 'SELLER',
    CUSTOMER = 'CUSTOMER'
}

interface DecodedToken {
    exp: number;
    userId: string;
    role: UserType; 
    [key: string]: any;
}

export const checkAuthStatus = async (requiredRole?: UserType): Promise<boolean> => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) return false;

    try {
        const decodedToken = jwtDecode<DecodedToken>(accessToken);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp > currentTime) {
            if (requiredRole) {
                return decodedToken.role === requiredRole;
            }
            return true;
        }
        return await refreshAccessToken();
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

export const getUserId = (role?: UserType): string | null => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) return null;

    try {
        const decodedToken = jwtDecode<DecodedToken>(accessToken);
        if (role) {
            return decodedToken.role === role ? decodedToken.userId : null;
        }
        return decodedToken.userId;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};


async function refreshAccessToken(): Promise<boolean> {
    const refreshToken = getCookie('refreshToken');
    if (!refreshToken) return false;

    try {
        const response = await fetch('/api/refresh-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            setCookie('accessToken', data.accessToken, data.expiresIn);
            return true;
        } else {
            logout();
            return false;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
    }
}

export function logout() {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
}

function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

function setCookie(name: string, value: string, expiresIn: number) {
    const date = new Date();
    date.setTime(date.getTime() + expiresIn * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}