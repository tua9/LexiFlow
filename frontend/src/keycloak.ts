import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://keycloak-production-85d0.up.railway.app',
  realm: 'myrealm',
  clientId: 'myclient',
});

export default keycloak;