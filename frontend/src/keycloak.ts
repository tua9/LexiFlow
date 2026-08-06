import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8080', //'https://keycloak-production-85d0.up.railway.app
  realm: 'myrealm',
  clientId: 'myclient',
});

export default keycloak;