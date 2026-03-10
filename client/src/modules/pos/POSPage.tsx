import { useState, useEffect, useRef, useCallback } from "react";
import { theme as antTheme, Grid, Badge, Drawer, Button, Tooltip, Dropdown, message } from "antd";
import {
  LogoutOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  UserOutlined,
  GiftOutlined,
  WalletOutlined,
  MonitorOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  LockOutlined,
  TableOutlined,
  SwapOutlined,
  SendOutlined,
  RollbackOutlined,
  GlobalOutlined,
  BgColorsOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useLocation } from "wouter";
import { AntProvider } from "@/lib/antd-provider";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { Role } from "@/types/auth";
import { ProductGrid } from "./components/ProductGrid";
import { CartPanel } from "./components/CartPanel";
import { ReceiptModal } from "./components/ReceiptModal";
import { IssueGiftCardModal } from "./components/modals/IssueGiftCardModal";
import { CheckBalanceModal } from "./components/modals/CheckBalanceModal";
import { OrderTabsBar } from "./components/orders/OrderTabsBar";
import { MergeOrdersModal } from "./components/orders/MergeOrdersModal";
import { LockScreen } from "./components/auth/LockScreen";
import type { CashierRole } from "./services/cashierAuthService";
import { CashInOutModal } from "./components/cashier/CashInOutModal";
import { OfflineBanner } from "./components/offline/OfflineBanner";
import { SyncStatusIndicator } from "./components/offline/SyncStatusIndicator";
import { POSContextProvider } from "./context/POSContext";
import { useCart } from "./hooks/useCart";
import { useCheckout } from "./hooks/useCheckout";
import { useOfflineSync } from "./hooks/useOfflineSync";
import { usePOSStore } from "./store/posStore";
import { usePOSTranslations } from "./i18n/translations";
import type { OrderTab } from "./store/posStore";
import { useRestaurantMode } from "./hooks/useRestaurantMode";
import { KitchenTicket } from "./components/restaurant/KitchenTicket";
import { SplitBillModal } from "./components/restaurant/SplitBillModal";
import { RefundModal } from "./components/RefundModal";
import { ExchangeModal } from "./components/ExchangeModal";
import { ThemeCustomizer } from "./components/ThemeCustomizer";
import { releaseTable } from "./services/tableService";
import { formatSeatedDuration } from "./data/mockRestaurant";

const { useBreakpoint } = Grid;

const SESSION_KEY = "pos-open-orders";
const CUSTOMER_DISPLAY_KEY = "pos-customer-display";

function Clock() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }, 10000);
    return () => clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

function POSLayout() {
  const { token } = antTheme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [, setLocation] = useLocation();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [issueGCOpen, setIssueGCOpen] = useState(false);
  const [checkBalanceOpen, setCheckBalanceOpen] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [cashInOpen, setCashInOpen] = useState(false);
  const [cashOutOpen, setCashOutOpen] = useState(false);
  const [splitBillOpen, setSplitBillOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const { addToCart, itemCount, cartItems, grandTotal } = useCart();
  const { receiptVisible, closeReceipt, completedOrder } = useCheckout();
  useOfflineSync();
  const { currentBranch, language, setLanguage } = useAppSettings();
  const isRTL = language === "ar";
  const t = usePOSTranslations(language);
  const restaurantMode = useRestaurantMode();

  const { user, logout } = useAuthContext();

  const restoreOrders      = usePOSStore((s) => s.restoreOrders);
  const orders             = usePOSStore((s) => s.orders);
  const activeOrderIndex   = usePOSStore((s) => s.activeOrderIndex);
  const cashierSession     = usePOSStore((s) => s.cashierSession);
  const setCashierSession  = usePOSStore((s) => s.setCashierSession);
  const lockSession        = usePOSStore((s) => s.lockSession);
  const posSettings        = usePOSStore((s) => s.posSessionSettings);
  const attachedTable      = usePOSStore((s) => s.attachedTable);
  const setAttachedTable   = usePOSStore((s) => s.setAttachedTable);
  const orderType          = usePOSStore((s) => s.orderType);
  const isDineIn           = orderType === "dine-in";

  // Table seated timer — update every 30s
  const [seatedDuration, setSeatedDuration] = useState("");
  useEffect(() => {
    if (!attachedTable?.seatedAt) { setSeatedDuration(""); return; }
    const update = () => setSeatedDuration(formatSeatedDuration(attachedTable.seatedAt!));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [attachedTable?.seatedAt]);

  // Fullscreen toggle
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  async function handleReleaseTable() {
    if (!attachedTable) return;
    try {
      await releaseTable(attachedTable.id);
      setAttachedTable(null);
      message.success(`Table ${attachedTable.name} released`);
    } catch {
      message.error("Failed to release table");
    }
  }

  // ── Auto-init session from ERP logged-in user ─────────────────────────────
  useEffect(() => {
    if (cashierSession || !user) return;
    const roleMap: Record<string, CashierRole> = {
      [Role.SuperAdmin]: "manager",
      [Role.Admin]:      "manager",
      [Role.Manager]:    "manager",
    };
    setCashierSession({
      cashierId:   user.id,
      cashierName: user.name,
      cashierRole: roleMap[user.role] ?? "cashier",
      loginTime:   new Date(),
      isLocked:    false,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ── Inactivity timer ──────────────────────────────────────────────────────
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (!cashierSession || cashierSession.isLocked) return;
    const ms = posSettings.inactivityLockMinutes * 60 * 1000;
    inactivityTimer.current = setTimeout(() => {
      lockSession();
    }, ms);
  }, [cashierSession, posSettings.inactivityLockMinutes, lockSession]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, resetInactivityTimer, { passive: true }));
    resetInactivityTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetInactivityTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [resetInactivityTimer]);

  // ── sessionStorage restore on mount ───────────────────────────────────────
  const didRestore = useRef(false);
  useEffect(() => {
    if (didRestore.current) return;
    didRestore.current = true;
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { orders: OrderTab[]; activeIndex: number };
        if (Array.isArray(parsed.orders) && parsed.orders.length > 0) {
          restoreOrders(parsed.orders, parsed.activeIndex ?? 0);
        }
      }
    } catch {
      // ignore malformed data
    }
  }, []);

  // ── sessionStorage + localStorage auto-save for customer display ──────────
  useEffect(() => {
    try {
      const payload = JSON.stringify({ orders, activeIndex: activeOrderIndex });
      sessionStorage.setItem(SESSION_KEY, payload);
      // Sync to localStorage so customer display window can read it
      const activeOrder = orders[activeOrderIndex];
      if (activeOrder) {
        localStorage.setItem(CUSTOMER_DISPLAY_KEY, JSON.stringify({
          items: activeOrder.cartItems,
          timestamp: Date.now(),
        }));
      }
    } catch {
      // ignore storage quota errors
    }
  }, [orders, activeOrderIndex]);

  function openCustomerDisplay() {
    window.open("/pos/customer-display", "customer-display",
      "width=900,height=600,menubar=no,toolbar=no,location=no,status=no"
    );
  }

  return (
    <POSContextProvider>
    <div dir={isRTL ? "rtl" : "ltr"} style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "hidden",
      background: token.colorBgLayout,
    }}>

      {/* Lock screen — shows when session is locked */}
      {cashierSession?.isLocked && <LockScreen />}

      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: isMobile ? 6 : 12,
        padding: isMobile ? "0 8px" : "0 16px",
        height: isMobile ? 44 : 54,
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        flexShrink: 0,
        boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
      }}>
        {/* Logout */}
        <Tooltip title="Logout">
          <Button
            icon={<LogoutOutlined />}
            onClick={() => { logout(); window.location.href = "/login"; }}
            danger
            size={isMobile ? "small" : "middle"}
            style={{ borderRadius: isMobile ? 6 : 10, height: isMobile ? 28 : 36, width: isMobile ? 28 : 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          />
        </Tooltip>

        {/* Logo + title */}
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 6 : 8 }}>
          <div style={{
            width: isMobile ? 26 : 30, height: isMobile ? 26 : 30, borderRadius: isMobile ? 6 : 8,
            background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimary}cc)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 900, fontSize: isMobile ? 11 : 13, flexShrink: 0,
          }}>
            T
          </div>
          {!isMobile && (
            <>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: token.colorText, lineHeight: 1.2 }}>{t.pointOfSale}</div>
                <div style={{ fontSize: 10, color: token.colorTextSecondary, lineHeight: 1.2 }}>{currentBranch.name}</div>
              </div>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: "0.06em",
                background: token.colorPrimaryBg, color: token.colorPrimary,
                borderRadius: 5, padding: "2px 6px", textTransform: "uppercase",
                border: `1px solid ${token.colorPrimary}30`,
              }}>
                POS
              </span>
            </>
          )}
        </div>

        {/* Restaurant: attached table badge */}
        {restaurantMode.isRestaurant && isDineIn && attachedTable && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#F59E0B10",
            border: "1.5px solid #F59E0B40",
            borderRadius: 10,
            padding: "4px 10px",
            fontSize: 12,
            fontWeight: 700,
            color: "#D97706",
          }}>
            <TableOutlined style={{ fontSize: 12 }} />
            {t.tableAttached(attachedTable.name)}
            {seatedDuration && (
              <>
                <div style={{ width: 1, height: 12, background: "#F59E0B30" }} />
                <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: "#F59E0B" }}>
                  <ClockCircleOutlined style={{ fontSize: 10 }} />
                  {seatedDuration}
                </span>
              </>
            )}
            <div style={{ width: 1, height: 12, background: "#F59E0B30" }} />
            <Tooltip title={t.releaseTable}>
              <button
                onClick={handleReleaseTable}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#EF4444", fontSize: 11, padding: 0, lineHeight: 1,
                }}
              >
                ✕
              </button>
            </Tooltip>
          </div>
        )}

        {/* Restaurant: table map button */}
        {restaurantMode.isRestaurant && isDineIn && restaurantMode.tableManagementEnabled && (
          <Tooltip title={t.tableMap}>
            <Button
              icon={<TableOutlined />}
              onClick={() => setLocation("/pos/tables")}
              style={{ borderRadius: 10, height: 36, width: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            />
          </Tooltip>
        )}

        {/* Restaurant: transfer table button */}
        {restaurantMode.isRestaurant && isDineIn && attachedTable && (
          <Tooltip title={t.transferTable}>
            <Button
              icon={<SwapOutlined />}
              onClick={() => setLocation("/pos/tables")}
              style={{ borderRadius: 10, height: 36, width: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#F59E0B", borderColor: "#F59E0B40" }}
            />
          </Tooltip>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isMobile && (
            <>
              {restaurantMode.isRestaurant && restaurantMode.kitchenPrintingEnabled && (
                <Tooltip title={t.sendToKitchen}>
                  <Button
                    icon={<SendOutlined />}
                    onClick={() => {
                      const kc = document.getElementById("kitchen-ticket-btn");
                      if (kc) (kc as HTMLButtonElement).click();
                    }}
                    disabled={cartItems.length === 0}
                    style={{
                      borderRadius: 10, height: 36, fontSize: 12,
                      background: cartItems.length > 0 ? `linear-gradient(135deg, #F59E0B, #D97706)` : undefined,
                      border: "none",
                      color: cartItems.length > 0 ? "#fff" : undefined,
                    }}
                  >
                    {t.sendToKitchen}
                  </Button>
                </Tooltip>
              )}
              {cashierSession && (
                <>
                  <Tooltip title={t.recordCashIn}>
                    <Button
                      icon={<ArrowDownOutlined />}
                      onClick={() => setCashInOpen(true)}
                      style={{ borderRadius: 10, height: 36, fontSize: 12, color: "#10B981", borderColor: "#10B98140" }}
                    >
                      {t.cashIn}
                    </Button>
                  </Tooltip>
                  <Tooltip title={t.recordCashOut}>
                    <Button
                      icon={<ArrowUpOutlined />}
                      onClick={() => setCashOutOpen(true)}
                      style={{ borderRadius: 10, height: 36, fontSize: 12, color: "#EF4444", borderColor: "#EF444440" }}
                    >
                      {t.cashOut}
                    </Button>
                  </Tooltip>
                  <div style={{ width: 1, height: 20, background: token.colorBorderSecondary, margin: "0 2px" }} />
                </>
              )}
              <Tooltip title={t.refund}>
                <Button
                  icon={<RollbackOutlined />}
                  onClick={() => setRefundOpen(true)}
                  style={{ borderRadius: 10, height: 36, fontSize: 12, color: "#EF4444", borderColor: "#EF444440" }}
                >
                  {t.refund}
                </Button>
              </Tooltip>
              <Tooltip title={t.exchange}>
                <Button
                  icon={<SwapOutlined />}
                  onClick={() => setExchangeOpen(true)}
                  style={{ borderRadius: 10, height: 36, fontSize: 12, color: "#6366F1", borderColor: "#6366F140" }}
                >
                  {t.exchange}
                </Button>
              </Tooltip>
              <Tooltip title={t.issueGiftCard}>
                <Button
                  icon={<GiftOutlined />}
                  onClick={() => setIssueGCOpen(true)}
                  style={{ borderRadius: 10, height: 36, fontSize: 12 }}
                >
                  {t.issueGiftCard}
                </Button>
              </Tooltip>
              <Tooltip title={t.checkBalance}>
                <Button
                  icon={<WalletOutlined />}
                  onClick={() => setCheckBalanceOpen(true)}
                  style={{ borderRadius: 10, height: 36, fontSize: 12 }}
                >
                  {t.checkBalance}
                </Button>
              </Tooltip>
<Tooltip title={t.customerDisplay}>
                <Button
                  icon={<MonitorOutlined />}
                  onClick={openCustomerDisplay}
                  style={{ borderRadius: 10, height: 36, width: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                />
              </Tooltip>
              <div style={{ width: 1, height: 20, background: token.colorBorderSecondary, margin: "0 4px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: token.colorTextSecondary, fontSize: 12 }}>
                <UserOutlined style={{ fontSize: 12 }} />
                <span>{cashierSession ? cashierSession.cashierName : t.noCashier}</span>
              </div>
              {cashierSession && (
                <Tooltip title={t.lockTerminal}>
                  <Button
                    icon={<LockOutlined />}
                    onClick={lockSession}
                    size="small"
                    style={{ borderRadius: 8, height: 28, width: 28, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", color: token.colorTextTertiary }}
                  />
                </Tooltip>
              )}
              <SyncStatusIndicator />
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: token.colorTextSecondary, fontSize: 12 }}>
                <ClockCircleOutlined style={{ fontSize: 12 }} />
                <Clock />
              </div>
              <Tooltip title={isRTL ? "Switch to English" : "التبديل إلى العربية"}>
                <Button
                  icon={<GlobalOutlined />}
                  onClick={() => setLanguage(isRTL ? "en" : "ar")}
                  style={{ borderRadius: 10, height: 36, fontSize: 12, fontWeight: 700 }}
                >
                  {isRTL ? "EN" : "AR"}
                </Button>
              </Tooltip>
              <Tooltip title={isFullscreen ? t.exitFullscreen : t.fullscreen}>
                <Button
                  icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  onClick={toggleFullscreen}
                  style={{ borderRadius: 10, height: 36, width: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                />
              </Tooltip>
              <Tooltip title="Theme Customizer">
                <Button
                  icon={<BgColorsOutlined />}
                  onClick={() => setCustomizerOpen(true)}
                  style={{ borderRadius: 10, height: 36, width: 36, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                />
              </Tooltip>
            </>
          )}

          {/* Mobile action buttons */}
          {isMobile && (
            <>
              <Button
                icon={<GlobalOutlined />}
                onClick={() => setLanguage(isRTL ? "en" : "ar")}
                size="small"
                style={{ borderRadius: 8, height: 32, width: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              />
              <Dropdown
                trigger={["click"]}
                placement="bottomRight"
                menu={{
                  items: [
                    { key: "refund", icon: <RollbackOutlined style={{ color: "#EF4444" }} />, label: t.refund, onClick: () => setRefundOpen(true) },
                    { key: "exchange", icon: <SwapOutlined style={{ color: "#6366F1" }} />, label: t.exchange, onClick: () => setExchangeOpen(true) },
                    { type: "divider" as const },
                    { key: "giftcard", icon: <GiftOutlined />, label: t.issueGiftCard, onClick: () => setIssueGCOpen(true) },
                    { key: "balance", icon: <WalletOutlined />, label: t.checkBalance, onClick: () => setCheckBalanceOpen(true) },
                    { type: "divider" as const },
                    { key: "theme", icon: <BgColorsOutlined />, label: "Theme", onClick: () => setCustomizerOpen(true) },
                  ],
                }}
              >
                <Button
                  icon={<MoreOutlined />}
                  size="small"
                  style={{ borderRadius: 8, height: 32, width: 32, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
                />
              </Dropdown>
              <Badge count={itemCount} color={token.colorPrimary} size="small">
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  onClick={() => setCartDrawerOpen(true)}
                  size="small"
                  style={{ borderRadius: 8, height: 32 }}
                >
                  {t.cart}
                </Button>
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}>
        {/* Left — Order Tabs + Product Grid (60%) */}
        <div style={{
          flex: isMobile ? "1" : "1 1 60%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <OfflineBanner />
          <OrderTabsBar onMergeClick={() => setMergeOpen(true)} isMobile={isMobile} />
          <div style={{
            flex: 1,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            background: token.colorBgContainer,
            borderRadius: 0,
            border: "none",
            padding: isMobile ? "12px 12px 0" : "12px",
          }}>
            <ProductGrid onAdd={addToCart} isMobile={isMobile} />
          </div>
        </div>

        {/* Right — Cart Panel (40%) — full height from navbar to bottom */}
        {!isMobile && (
          <div style={{
            flex: "1 1 40%",
            minWidth: 320,
            minHeight: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            borderInlineStart: `1px solid ${token.colorBorderSecondary}`,
          }}>
            <CartPanel isMobile={false} />
          </div>
        )}
      </div>

      {/* Mobile cart drawer */}
      {isMobile && (
        <Drawer
          open={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
          placement="bottom"
          height="85vh"
          title={null}
          closeIcon={null}
          styles={{
            body: { padding: 0, display: "flex", flexDirection: "column" },
            content: { borderRadius: "16px 16px 0 0" },
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 6px", flexShrink: 0 }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: token.colorBorderSecondary }} />
          </div>
          <div style={{ flex: 1, overflow: "hidden", padding: "0 12px 12px" }}>
            <CartPanel isMobile={true} />
          </div>
        </Drawer>
      )}

      {/* Modals */}
      <ReceiptModal open={receiptVisible} order={completedOrder} onClose={closeReceipt} />
      <RefundModal open={refundOpen} onClose={() => setRefundOpen(false)} />
      <ExchangeModal open={exchangeOpen} onClose={() => setExchangeOpen(false)} />
      <ThemeCustomizer open={customizerOpen} onClose={() => setCustomizerOpen(false)} />
      <IssueGiftCardModal open={issueGCOpen} onClose={() => setIssueGCOpen(false)} />
      <CheckBalanceModal open={checkBalanceOpen} onClose={() => setCheckBalanceOpen(false)} />
      <MergeOrdersModal open={mergeOpen} onClose={() => setMergeOpen(false)} />
      <CashInOutModal type="in"  open={cashInOpen}  onClose={() => setCashInOpen(false)}  />
      <CashInOutModal type="out" open={cashOutOpen} onClose={() => setCashOutOpen(false)} />
      {/* Restaurant modals */}
      {restaurantMode.isRestaurant && (
        <SplitBillModal
          open={splitBillOpen}
          onClose={() => setSplitBillOpen(false)}
          cartItems={cartItems}
          grandTotal={grandTotal}
          isMobile={isMobile}
        />
      )}
      {/* Hidden kitchen ticket trigger (used by header button) */}
      {restaurantMode.isRestaurant && restaurantMode.kitchenPrintingEnabled && (
        <div style={{ display: "none" }}>
          <KitchenTicket items={cartItems} compact />
        </div>
      )}
    </div>
    </POSContextProvider>
  );
}

export default function POSPage() {
  return (
    <AntProvider>
      <POSLayout />
    </AntProvider>
  );
}
