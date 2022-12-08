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

`pubeler --configFile <config-file --required> --dataFile <data-file --required>`

#### Note: This application uses the device workflow, so you will need to complete the authentication process with your identity provider.

## getting help

`pubeler --help`

If this doesn't provide what you need, feel free to submit a new issue ticket [here](https://github.com/ikemtz/pubeler/issues/new).

## config file

This is a JSON file that will inform Pubeler on how to authenticate with your identity provider and communicate with your APIs.

Here's a sample:

```
{
  "textDelimeter": "\t",
  "postDestinationUrl": "https://my-post-url.com/api/myrecords.json",
  "oauth_client_id": "my-client-id",
  "oauth_device_code_url": "https://{tenant-name}.auth0.com/oauth/token",
  "oauth_token_url": "https://{tenant-name}.auth0.com/oauth/token",
  "oauth_audience": "{your-audience}",
  "oauth_scope": "openid",
  // This is an optional setting, only to be used when absolutely necessary
  "skip_ssl_validation": false,
}
```

#### Note: Your identity provider has to support the device workflow. I recommend using [Auth0](https://auth0.com/docs/flows/concepts/device-auth) as they have an easy to use implementation of this workflow.

## error handling

If a post related error occurs, a new txt file will be created containing the records that caused an error response (HTTP 400-500 response codes.) This file will allow you to easily retry failed records in a subsequent run. The generated text file name will be named: `{url pathinfo}.{timestamp (yyMMddHHmmss)}.failures.txt`. An example of this would be: myrecords.json.221208011433.failures.txt.

The server response which typically indicates why the post request failed will be logged to the console. Additionally, authentication/OAuth related errors will be logged to the console as well.
