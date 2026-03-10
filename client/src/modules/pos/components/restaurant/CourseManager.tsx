import { useState, useEffect } from "react";
import { Select, Input, theme as antTheme } from "antd";
import { BookOutlined } from "@ant-design/icons";
import type { CartItem } from "../../store/posStore";
import { usePOSStore } from "../../store/posStore";
import { getCourses } from "../../services/tableService";
import type { CourseType } from "../../data/mockRestaurant";
import { useAppSettings } from "@/contexts/AppSettingsContext";
import { usePOSTranslations } from "../../i18n/translations";

interface CourseManagerProps {
  items: CartItem[];
}

export function CourseManager({ items }: CourseManagerProps) {
  const { token } = antTheme.useToken();
  const { language } = useAppSettings();
  const t = usePOSTranslations(language);
  const setItemCourse = usePOSStore((s) => s.setItemCourse);
  const setItemNote   = usePOSStore((s) => s.setItemNote);
  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  if (items.length === 0) return null;

  const courseOptions = [
    { value: "", label: t.noCourse },
    ...courses.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div style={{
      border: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: 10,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        background: token.colorFillAlter,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        fontSize: 11,
        fontWeight: 700,
        color: token.colorTextSecondary,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}>
        <BookOutlined style={{ fontSize: 10 }} />
        {t.assignCourse} / {t.kitchenNote}
      </div>

      {items.map((item, idx) => (
        <div
          key={item.product.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderBottom: idx < items.length - 1 ? `1px solid ${token.colorBorderSecondary}` : "none",
          }}
        >
          {/* Item color dot */}
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: item.product.color, flexShrink: 0,
          }} />

          {/* Item name */}
          <span style={{
            fontSize: 11, fontWeight: 600, color: token.colorText,
            flex: "0 0 auto", maxWidth: 100,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.quantity}× {item.product.name}
          </span>

          {/* Course select */}
          <Select
            value={item.course ?? ""}
            onChange={(v) => setItemCourse(item.product.id, v)}
            options={courseOptions}
            size="small"
            style={{ width: 110, flexShrink: 0 }}
            placeholder={t.noCourse}
          />

          {/* Note input */}
          <Input
            value={item.note ?? ""}
            onChange={(e) => setItemNote(item.product.id, e.target.value)}
            placeholder={t.kitchenNote}
            size="small"
            style={{ flex: 1, borderRadius: 6 }}
            maxLength={60}
          />
        </div>
      ))}
    </div>
  );
}
