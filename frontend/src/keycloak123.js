import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
 url: "http://localhost:8080/",
 realm: "flask-app",
 clientId: "flask",
});

export default keycloak;

// import Keycloak from 'keycloak-js';

// const keycloak =new Keycloak('./keycloak.json');

// export default keycloak;