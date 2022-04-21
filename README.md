# lb-base
## Use

- Install docker and docker-compose on your machine.
- Create .env file.
- Open the envirotment you need: prod, dev, testing.
- Go to http://localhost:3000 on prod and dev.

## Environments
### Prod(uction).
- docker network create back
- npm run start:prod:docker

### Dev(elopment).
- docker network create back
- npm run start:dev:docker

### Testing. Functional tests.
- docker network create back
- npm run start:test:docker

## Observations

- [21/04/2022] Se declina el uno de authentication-jwt en su v0.11.2 porque:
1. En el middleware/auth.midd.ts no le llega el dato de role, lo que hace la authorization inviable.
2. Authentication-jwt esta verde, hay que modificar la extension porque sino en todos los endpoints del explorador sale el candado y confunde. Tampoco esta integrado con la authorization.
