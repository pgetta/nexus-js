import * as React from 'react';
import invariant from 'ts-invariant';
import { NexusClient } from '@bbp/nexus-sdk';
import nexusContext from './nexusContext';
import { Observable } from '@bbp/nexus-link';

const warningMessage =
  'No Nexus client found. ' +
  'To use react-nexus components, make sure you wrap your React app with the NexusProvider component' +
  ' like: <NexusProvider nexusClient={myClient)><App /></NexusProvider>. ';

export default function useNexus<T = any, S = any>(
  apiCall: (nexus: NexusClient) => Promise<any> | Observable<any>,
  inputs: any[] = [],
) {
  const nexus = React.useContext<NexusClient>(nexusContext);
  const [state, setState] = React.useState<{
    loading: boolean;
    error: S;
    data: T;
  }>({
    loading: true,
    error: null,
    data: null,
  });
  invariant(nexus, warningMessage);
  React.useEffect(() => {
    setState({ ...state, loading: true });
    const res = apiCall(nexus);
    if (res instanceof Promise) {
      res
        .then((data: T) => setState({ ...state, data, loading: false }))
        .catch((error: S) => setState({ ...state, error, loading: false }));
      return () => {};
    }
    const subscription = (res as Observable<T>).subscribe({
      next: (data: T) => {
        setState({ ...state, data, loading: false });
      },
      error: (error: S) => {
        setState({ ...state, error, loading: false });
      },
      complete: () => {
        subscription.unsubscribe();
      }
    });
    return () => subscription.unsubscribe();
  }, inputs);

  return state;
}