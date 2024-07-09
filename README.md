# TOKEN FETCHER

### Disclaimer
This is a pre-alpha version.

### Description
This app fetches OAuth 2.0 `accesstoken`, `id token`, and `refresh token` for further processing/attribute check.

### Goals
The goal of this project is to enhance DX for developers who are focused on a token’s content rather then on different parameters or aspects of an OAuth 2.0 flow itself. The app provides a quick and convenient way of fetching a token set with `access token`, `id token`, and `refresh token`(if applicable).

The app currently supports the following flows:
- **Authorization code** 
- **Refresh token**


### Instructions
1. Run `docker build -t token-fetcher .`
2. Run `docker run --rm -p "3333:3333" --name token-fetcher-container token-fetcher`

### Credits
- Favicon Icon - https://www.flaticon.com/free-icons/keychain
- Under Construction Icon - https://www.flaticon.com/free-icons/under-construction