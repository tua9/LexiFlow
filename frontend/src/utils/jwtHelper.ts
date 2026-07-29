import type { JwtPayload } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import keycloak from '../keycloak';

export interface KeycloakTokenPayload extends JwtPayload {
    azp?: string;
    session_state?: string;
    acr?: string;
    realm_access?: {
        roles: string[];
    };
    resource_access?: {
        [key: string]: {
            roles: string[];
        };
    };
    scope?: string;
    sid?: string;
    email_verified?: boolean;
    name?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
    email?: string;
}

export const getTokenPayload = () => {
    const accessToken = keycloak.token;

    try {
        const decoded = jwtDecode<KeycloakTokenPayload>(accessToken!);
        console.log("Decode Token => sub = " + decoded.sub)
        return decoded;
    } catch (error) {
        console.error("Invalid token format:", error);
    }
}