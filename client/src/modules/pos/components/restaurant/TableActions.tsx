import { useState } from "react";
import { Button, InputNumber, Modal, Popconfirm, Tooltip, message, theme as antTheme } from "antd";
import {
  TeamOutlined,
  SwapOutlined,
  UnlockOutlined,
  LockOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { RestaurantTable } from "../../data/mockRestaurant";
import { occupyTable, releaseTable, updateTable, transferTable } from "../../services/tableService";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface TableActionsProps {
  table: RestaurantTable;
  onUpdated: () => void;
  /** Available tables to transfer to */
  availableTables?: RestaurantTable[];
}

export function TableActions({ table, onUpdated, availableTables }: TableActionsProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);

  const [editGuestsOpen, setEditGuestsOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(table.guestCount ?? 1);
  const [transferOpen, setTransferOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEditGuests() {
    setLoading(true);
    try {
      await updateTable(table.id, { guestCount });
      message.success(t.guestsUpdated);
      setEditGuestsOpen(false);
      onUpdated();
    } catch {
      message.error("Failed to update guests");
    } finally {
      setLoading(false);
    }
  }

  async function handleRelease() {
    setLoading(true);
    try {
      await releaseTable(table.id);
      message.success(t.tableReleased);
      onUpdated();
    } catch {
      message.error("Failed to release table");
    } finally {
      setLoading(false);
    }
  }

  async function handleReserve() {
    setLoading(true);
    try {
      await updateTable(table.id, { status: "reserved" });
      message.success(t.tableReserved);
      onUpdated();
    } catch {
      message.error("Failed to reserve table");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelReservation() {
    setLoading(true);
    try {
      await updateTable(table.id, { status: "available" });
      message.success(t.reservationCancelled);
      onUpdated();
    } catch {
      message.error("Failed to cancel reservation");
    } finally {
      setLoading(false);
    }
  }

  async function handleTransfer(toTable: RestaurantTable) {
    setLoading(true);
    try {
      await transferTable(table.id, toTable.id, table.guestCount ?? 1, table.orderTotal ?? 0);
      message.success(`Transferred to ${toTable.name}`);
      setTransferOpen(false);
      onUpdated();
    } catch {
      message.error("Failed to transfer table");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Occupied table actions */}
        {table.status === "occupied" && (
          <>
            <Tooltip title={t.editGuests}>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => { setGuestCount(table.guestCount ?? 1); setEditGuestsOpen(true); }}
                style={{ borderRadius: 6, fontSize: 10, height: 26, flex: 1 }}
              >
                {t.editGuests}
              </Button>
            </Tooltip>
            {availableTables && availableTables.length > 0 && (
              <Tooltip title={t.transferTable}>
                <Button
                  size="small"
                  icon={<SwapOutlined />}
                  onClick={() => setTransferOpen(true)}
                  style={{ borderRadius: 6, fontSize: 10, height: 26, color: "#F59E0B", borderColor: "#F59E0B40", flex: 1 }}
                >
                  {t.transferTable}
                </Button>
              </Tooltip>
            )}
            <Popconfirm
              title={t.confirmReleaseTable}
              onConfirm={handleRelease}
              okText={t.releaseTable}
              cancelText={t.cancel}
              okButtonProps={{ danger: true }}
            >
              <Button
                size="small"
                icon={<UnlockOutlined />}
                danger
                style={{ borderRadius: 6, fontSize: 10, height: 26, flex: 1 }}
              >
                {t.releaseTable}
              </Button>
            </Popconfirm>
          </>
        )}

        {/* Available table actions */}
        {table.status === "available" && (
          <Tooltip title={t.reserveTable}>
            <Button
              size="small"
              icon={<LockOutlined />}
              onClick={handleReserve}
              loading={loading}
              style={{ borderRadius: 6, fontSize: 10, height: 26, color: "#6366F1", borderColor: "#6366F140", flex: 1 }}
            >
              {t.reserveTable}
            </Button>
          </Tooltip>
        )}

        {/* Reserved table actions */}
        {table.status === "reserved" && (
          <Button
            size="small"
            icon={<UnlockOutlined />}
            onClick={handleCancelReservation}
            loading={loading}
            style={{ borderRadius: 6, fontSize: 10, height: 26, color: "#EF4444", borderColor: "#EF444440", flex: 1 }}
          >
            {t.cancelReservation}
          </Button>
        )}
      </div>

      {/* Edit Guests Modal */}
      <Modal
        open={editGuestsOpen}
        onCancel={() => setEditGuestsOpen(false)}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TeamOutlined style={{ color: token.colorPrimary }} />
            <span>{t.editGuests} — {table.name}</span>
          </div>
        }
        width={340}
        centered
        footer={
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Button onClick={() => setEditGuestsOpen(false)} style={{ borderRadius: 8 }}>
              {t.cancel}
            </Button>
            <Button
              type="primary"
              loading={loading}
              onClick={handleEditGuests}
              style={{ borderRadius: 8 }}
            >
              {t.save}
            </Button>
          </div>
        }
      >
        <div style={{ padding: "16px 0" }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: token.colorText, display: "block", marginBottom: 8 }}>
            {t.numberOfGuests}
          </label>
          <InputNumber
            min={1}
            max={table.capacity}
            value={guestCount}
            onChange={(v) => setGuestCount(v ?? 1)}
            style={{ width: "100%", borderRadius: 8 }}
            size="large"
          />
          <div style={{ marginTop: 6, fontSize: 11, color: token.colorTextSecondary }}>
            {t.tableCapacity(table.capacity)}
          </div>
        </div>
      </Modal>

      {/* Transfer Table Modal */}
      <Modal
        open={transferOpen}
        onCancel={() => setTransferOpen(false)}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <SwapOutlined style={{ color: "#F59E0B" }} />
            <span>{t.transferTable} — {table.name}</span>
          </div>
        }
        width={400}
        centered
        footer={null}
      >
        <div style={{ padding: "8px 0", display: "flex", flexDirection: "column", gap: 6, maxHeight: 300, overflowY: "auto" }}>
          {availableTables?.map((tbl) => (
            <Button
              key={tbl.id}
              onClick={() => handleTransfer(tbl)}
              loading={loading}
              style={{
                borderRadius: 10,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 14px",
              }}
            >
              <span style={{ fontWeight: 700 }}>{tbl.name}</span>
              <span style={{ fontSize: 11, color: token.colorTextSecondary }}>
                {tbl.capacity} seats
              </span>
            </Button>
          ))}
        </div>
      </Modal>
    </>
  );
}
