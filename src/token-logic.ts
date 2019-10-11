import axios from 'axios';
import { DeviceCodeResponse } from './device-code-response';
import { TokenResponse } from './token-response';
import { pollWrapper } from './poll-wrapper';
import { Config } from './config';
import chalk from 'chalk';
const qs = require('querystring');

export class TokenLogic {
  constructor(private readonly config: Config) {}
  public async getToken(): Promise<TokenResponse> {
    const deviceCode = await this.requestUserCode();
    const expirationTime = new Date(new Date().getTime() + deviceCode.expires_in * 1000);
    console.log(
      `Your user code is ${chalk.green(deviceCode.user_code)} and will expire at ${chalk.red(
        expirationTime.toLocaleTimeString(),
      )}`,
    );
    console.log(`Navigate to: ${chalk.blueBright(deviceCode.verification_uri_complete)}`);

    console.log('Waiting for device authorization ...');
    const { future } = await pollWrapper<TokenResponse>({
      request: () => this.requestDeviceToken(deviceCode),
      pollingPeriodInMs: 2500,
      shouldStopWhen: token => new Date() > expirationTime || !!token.access_token,
    });
    return future;
  }

  private async requestUserCode(): Promise<DeviceCodeResponse> {
    console.log('Requesting User Code ...');
    const response = await axios.post(
      this.config.oauth_device_code_url,
      qs.stringify({
        client_id: this.config.oauth_client_id,
        scope: this.config.oauth_scope,
        audience: this.config.oauth_audience,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const deviceCode: DeviceCodeResponse = response.data;
    return deviceCode;
  }

  private async requestDeviceToken(deviceCodeResponse: DeviceCodeResponse): Promise<TokenResponse> {
    try {
      let response = await axios.post(
        this.config.oauth_token_url,
        qs.stringify({
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          device_code: deviceCodeResponse.device_code,
          client_id: this.config.oauth_client_id,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      const deviceCode: TokenResponse = response.data;
      if (deviceCode.access_token) {
        console.log('Access Granted');
      }
      return deviceCode;
    } catch (err) {
      return err.response.data;
    }
  }
}
