import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface FlagsProviderProps {
  children: ReactNode;
}

export interface Flags {
  maintenanceDownBlock: number;
  forceMaintenanceDown: boolean;
  useExternalOraclePrice: boolean;
  oracleFeedResumeTime: string;
}

// @ts-ignore
const FlagsContext: Context<Flags> = createContext<Flags>();

export function FlagsProvider({ children }: FlagsProviderProps) {
  const [flags, setFlags] = useState<Flags>(() => ({
    maintenanceDownBlock: -1,
    forceMaintenanceDown: false,
    useExternalOraclePrice: false,
    oracleFeedResumeTime: 'Thu Sep 30 2021 xx:xx:xx UTC',
  }));

  useEffect(() => {
    function task() {
      fetch(
        `https://anchor-protocol.github.io/anchor-web-assets/flags.json?timestamp=${Date.now()}`,
      )
        .then((res) => res.json())
        .then(setFlags);
    }

    task();

    const intervalId = setInterval(task, 1000 * 30);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
  );
}

export function useFlags(): Flags {
  return useContext(FlagsContext);
}

export const FlagsConsumer: Consumer<Flags> = FlagsContext.Consumer;
