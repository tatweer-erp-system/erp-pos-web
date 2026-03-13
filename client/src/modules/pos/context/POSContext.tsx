import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import {
  ManagerOverrideModal,
  type OverrideRequest,
} from "../components/auth/ManagerOverrideModal";

interface POSContextValue {
  /**
   * Request a manager override. Resolves to the manager's name on approval,
   * or null if denied / cancelled.
   */
  requestManagerOverride: (
    reason: string,
    action: string
  ) => Promise<string | null>;
}

const POSContext = createContext<POSContextValue>({
  requestManagerOverride: async () => null,
});

export function usePOSContext() {
  return useContext(POSContext);
}

export function POSContextProvider({ children }: { children: ReactNode }) {
  const [overrideRequest, setOverrideRequest] =
    useState<OverrideRequest | null>(null);

  const requestManagerOverride = useCallback(
    (reason: string, action: string): Promise<string | null> => {
      return new Promise(resolve => {
        setOverrideRequest({
          reason,
          action,
          onApprove: managerName => {
            setOverrideRequest(null);
            resolve(managerName);
          },
          onDeny: () => {
            setOverrideRequest(null);
            resolve(null);
          },
        });
      });
    },
    []
  );

  return (
    <POSContext.Provider value={{ requestManagerOverride }}>
      {children}
      <ManagerOverrideModal
        request={overrideRequest}
        onClose={() => {
          overrideRequest?.onDeny();
          setOverrideRequest(null);
        }}
      />
    </POSContext.Provider>
  );
}
