# TOKEN FETCHER

### Disclaimer
This is a beta version.

### Description
This app fetches OAuth 2.0 `accesstoken`, `id token`, and `refresh token` for further processing/attribute check.

### Goals
The goal of this project is to enhance DX for developers who are focused on a token’s content rather then on different parameters or aspects of an OAuth 2.0 flow itself. The app provides a quick and convenient way of fetching `access`, `id`, and `refresh`(if applicable) tokens.

The app currently supports the following flows:
- **Authorization code** (including the token`response type`) 
- **Refresh token**


### Instructions
1. Run `docker build -t token-fetcher .`
2. Run `docker run --rm -p "3333:3333" -v ${PWD}/.data:/src/.data --name token-fetcher-container token-fetcher`.

3. If you like this project, consider giving it a ⭐️

### Credits
- Favicon Icon - https://www.flaticon.com/free-icons/keychain
<!-- - Under Construction Icon - https://www.flaticon.com/free-icons/under-construction -->