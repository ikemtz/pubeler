export interface PollWrapperConfig<T> {
  request(): Promise<T>;
  pollingPeriodInMs: number;
  shouldStopWhen(t: T): boolean;
}
export function pollWrapper<T>(config: PollWrapperConfig<T>) {
  let canceled = false;
  const cancel = () => {
    canceled = true;
  };

  const poll = (resolve: any, reject: any) => {
    if (canceled) {
      reject(new Error('Polling has been manually canceled'));
      return;
    }

    config
      .request()
      .then(response => {
        if (config.shouldStopWhen(response)) {
          resolve(response);
        } else {
          setTimeout(() => {
            poll(resolve, reject);
          }, config.pollingPeriodInMs);
        }
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  };

  return { future: new Promise<T>(poll), cancel: cancel };
}
