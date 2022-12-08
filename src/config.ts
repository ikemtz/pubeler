export interface Config {
  textDelimeter: string;
  postDestinationUrl: string;
  oauth_client_id: string;
  oauth_device_code_url: string;
  oauth_audience: string;
  oauth_scope: string;
  oauth_token_url: string;
  skip_ssl_validation?: boolean;
}
