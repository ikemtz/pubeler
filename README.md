# pubeler

pronounced pyüb-lər

A utility to automate the publishing of data contained in flat files to resful APIs. At this time this is setup to use device OAuth workflow.

## installation

```
npm install --global pubeler
```

or

```
npm i -g pubeler
```

## running it

pubeler -C <config-file --required> -D <data-file --required>

#### Note: This application uses the device workflow, so you will need to complete the authentication process with your identity provider.

## config file

This is a JSON file that will inform Pubeler on how to authenticate and communicate with your APIs.

Here's a sample:

```
{
  "textDelimeter": "\t",
  "postDestinationUrl": "https://my-post-url.com",
  "oauth_client_id": "my-client-id",
  "oauth_device_code_url": "https://{tenant-name}.auth0.com/oauth/token",
  "oauth_token_url": "https://{tenant-name}.auth0.com/oauth/token",
  "oauth_audience": "{your-audience}",
  "oauth_scope": "openid",
  // This is an optional setting, only to be used when necessary
  "skip_ssl_validation": false,
}
```

#### Note: Your identity provider has to support the device workflow. I recommend using [Auth0](https://auth0.com/docs/flows/concepts/device-auth) as they support an easy implementation of this workflow.
