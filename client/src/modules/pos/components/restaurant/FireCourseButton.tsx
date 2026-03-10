import { useState, useEffect } from "react";
import { Button, Tag, message, theme as antTheme } from "antd";
import { SendOutlined, CheckCircleOutlined, ClockCircleOutlined, StarOutlined } from "@ant-design/icons";
import type { CartItem } from "../../store/posStore";
import type { CourseType, CourseStatus } from "../../data/mockRestaurant";
import { getCourses } from "../../services/tableService";
import { sendToKitchen } from "../../services/kitchenService";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";
import { usePOSStore } from "../../store/posStore";

interface FireCourseButtonProps {
  items: CartItem[];
}

const STATUS_COLOR: Record<CourseStatus, string> = {
  pending: "#F59E0B",
  sent:    "#6366F1",
  ready:   "#10B981",
  served:  "#6B7280",
};

const STATUS_ICON: Record<CourseStatus, React.ReactNode> = {
  pending: <ClockCircleOutlined />,
  sent:    <SendOutlined />,
  ready:   <StarOutlined />,
  served:  <CheckCircleOutlined />,
};

export function FireCourseButton({ items }: FireCourseButtonProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const cashierSession = usePOSStore((s) => s.cashierSession);
  const attachedTable  = usePOSStore((s) => s.attachedTable);
  const guestCount     = usePOSStore((s) => s.guestCount);
  const orders         = usePOSStore((s) => s.orders);
  const activeIdx      = usePOSStore((s) => s.activeOrderIndex);

  const [courses, setCourses] = useState<CourseType[]>([]);
  const [courseStatuses, setCourseStatuses] = useState<Record<string, CourseStatus>>({});
  const [firing, setFiring] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  if (items.length === 0) return null;

  // Group items by course
  const groupedByCourse = items.reduce<Record<string, CartItem[]>>((acc, item) => {
    const key = item.course ?? "no-course";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  function getCourseLabel(courseId: string): string {
    if (courseId === "no-course") return t.noCourse;
    return courses.find((c) => c.id === courseId)?.name ?? courseId;
  }

  async function fireCourse(courseId: string, courseItems: CartItem[]) {
    setFiring((prev) => ({ ...prev, [courseId]: true }));
    try {
      const orderNum = `ORD-${Date.now().toString().slice(-5)}`;
      await sendToKitchen({
        orderNumber: orderNum,
        tableName:   attachedTable?.name,
        guestCount,
        timestamp:   new Date().toISOString(),
        cashierName: cashierSession?.cashierName ?? "Cashier",
        items:       courseItems,
      });
      setCourseStatuses((prev) => ({ ...prev, [courseId]: "sent" }));
      message.success(`${getCourseLabel(courseId)} sent to kitchen`);
    } catch {
      message.error("Failed to send to kitchen");
    } finally {
      setFiring((prev) => ({ ...prev, [courseId]: false }));
    }
  }

  async function fireAll() {
    for (const [courseId, courseItems] of Object.entries(groupedByCourse)) {
      if (courseStatuses[courseId] === "sent") continue;
      await fireCourse(courseId, courseItems);
    }
  }

  const hasUnsent = Object.keys(groupedByCourse).some((id) => courseStatuses[id] !== "sent");

  return (
    <div style={{
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: 10,
      overflow: "hidden",
    }}>
      {/* Header with Fire All */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        background: token.colorFillAlter,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: token.colorTextSecondary, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {t.sendToKitchen}
        </span>
        {hasUnsent && (
          <Button
            size="small"
            icon={<SendOutlined />}
            onClick={fireAll}
            style={{
              fontSize: 11, height: 24, borderRadius: 6,
              background: "#F59E0B", borderColor: "#F59E0B", color: "#fff",
            }}
          >
            {t.fireAll}
          </Button>
        )}
      </div>

      {/* Course rows */}
      {Object.entries(groupedByCourse).map(([courseId, courseItems]) => {
        const status = courseStatuses[courseId] ?? "pending";
        const isFiring = firing[courseId];
        const statusColor = STATUS_COLOR[status];

        return (
          <div key={courseId} style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}>
            {/* Course label */}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: token.colorText, marginBottom: 3 }}>
                {getCourseLabel(courseId)}
              </div>
              <div style={{ fontSize: 11, color: token.colorTextSecondary }}>
                {courseItems.map((i) => `${i.quantity}× ${i.product.name}`).join(", ")}
              </div>
            </div>

            {/* Status tag */}
            <Tag style={{
              display: "flex", alignItems: "center", gap: 4,
              fontSize: 10, fontWeight: 700, padding: "2px 8px",
              background: `${statusColor}15`, border: `1px solid ${statusColor}40`,
              color: statusColor, borderRadius: 6,
            }}>
              {STATUS_ICON[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
            </Tag>

            {/* Fire button */}
            {status === "pending" && (
              <Button
                size="small"
                icon={<SendOutlined />}
                loading={isFiring}
                onClick={() => fireCourse(courseId, courseItems)}
                style={{
                  fontSize: 11, height: 28, borderRadius: 8,
                  background: `linear-gradient(135deg, #F59E0B, #D97706)`,
                  border: "none", color: "#fff", fontWeight: 600,
                }}
              >
                {t.fireCourse(getCourseLabel(courseId))}
              </Button>
            )}

            {/* Status change for sent items (mark as ready/served) */}
            {status === "sent" && (
              <Button
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => setCourseStatuses((prev) => ({ ...prev, [courseId]: "ready" }))}
                style={{ fontSize: 11, height: 28, borderRadius: 8, color: "#10B981", borderColor: "#10B98140" }}
              >
                Ready
              </Button>
            )}
            {status === "ready" && (
              <Button
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => setCourseStatuses((prev) => ({ ...prev, [courseId]: "served" }))}
                style={{ fontSize: 11, height: 28, borderRadius: 8, color: "#6B7280", borderColor: "#6B728040" }}
              >
                Served
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
