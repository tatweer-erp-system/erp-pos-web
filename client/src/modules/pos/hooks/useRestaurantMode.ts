import { usePOSStore } from "../store/posStore";

export interface RestaurantModeState {
  /** Master toggle — all restaurant features are hidden when false */
  isRestaurant: boolean;
  tableManagementEnabled: boolean;
  courseManagementEnabled: boolean;
  kitchenPrintingEnabled: boolean;
  autoSendKitchen: boolean;
  allowTakeAway: boolean;
  defaultGuests: number;
}

/**
 * Returns the current restaurant mode settings from the POS store.
 * Wrap restaurant-only UI with `if (!mode.isRestaurant) return null;`
 */
export function useRestaurantMode(): RestaurantModeState {
  const restaurantMode          = usePOSStore((s) => s.restaurantMode);
  const tableManagementEnabled  = usePOSStore((s) => s.tableManagementEnabled);
  const courseManagementEnabled = usePOSStore((s) => s.courseManagementEnabled);
  const kitchenPrintingEnabled  = usePOSStore((s) => s.kitchenPrintingEnabled);
  const autoSendKitchen         = usePOSStore((s) => s.autoSendKitchen);
  const allowTakeAway           = usePOSStore((s) => s.allowTakeAway);
  const defaultGuests           = usePOSStore((s) => s.defaultGuests);

  return {
    isRestaurant:           restaurantMode,
    tableManagementEnabled,
    courseManagementEnabled,
    kitchenPrintingEnabled,
    autoSendKitchen,
    allowTakeAway,
    defaultGuests,
  };
}
