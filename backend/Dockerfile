FROM quay.io/keycloak/keycloak:26.3

COPY keycloak/my-realm.json /opt/keycloak/data/import/

EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

CMD ["start-dev", "--import-realm"]