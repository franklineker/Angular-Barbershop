export const environment = {
    production: false,
    authorize_uri: 'http://localhost:8081/oauth2/authorize?',
    grant_type: 'authorization_code',
    client_id: 'client',
    redirect_uri: 'http://localhost:4200/authorized',
    scope: 'openid',
    response_type: 'code',
    response_mode: 'form_post',
    code_challenge_method: 'S256',
    token_url: 'http://localhost:8081/oauth2/token',
    logout_url: 'http://localhost:8081/logout',
    secret_pkce: 'secret',
    resource_base_url: 'http://localhost:9000'
};
