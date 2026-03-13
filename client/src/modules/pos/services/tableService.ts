import type {
  RestaurantTable,
  RestaurantSection,
  CourseType,
} from "../data/mockRestaurant";
import { mockTables, mockSections, mockCourses } from "../data/mockRestaurant";

// ── In-memory state ───────────────────────────────────────────────────────────

let tables: RestaurantTable[] = [...mockTables];
let sections: RestaurantSection[] = [...mockSections];
let courses: CourseType[] = [...mockCourses];

function delay(ms = 250): Promise<void> {
  return new Promise(res => setTimeout(res, ms));
}

// ── Tables ────────────────────────────────────────────────────────────────────

export async function getTables(): Promise<RestaurantTable[]> {
  await delay();
  return [...tables];
}

export async function getTable(id: string): Promise<RestaurantTable | null> {
  await delay(100);
  return tables.find(t => t.id === id) ?? null;
}

export async function occupyTable(
  id: string,
  guestCount: number
): Promise<RestaurantTable> {
  await delay(200);
  tables = tables.map(t =>
    t.id === id
      ? {
          ...t,
          status: "occupied",
          seatedAt: new Date().toISOString(),
          guestCount,
          orderTotal: 0,
        }
      : t
  );
  return tables.find(t => t.id === id)!;
}

export async function updateTableTotal(
  id: string,
  total: number
): Promise<void> {
  await delay(100);
  tables = tables.map(t => (t.id === id ? { ...t, orderTotal: total } : t));
}

export async function releaseTable(id: string): Promise<void> {
  await delay(200);
  tables = tables.map(t =>
    t.id === id
      ? {
          ...t,
          status: "available",
          seatedAt: undefined,
          guestCount: undefined,
          orderTotal: undefined,
        }
      : t
  );
}

export async function transferTable(
  fromId: string,
  toId: string,
  guestCount: number,
  orderTotal: number
): Promise<void> {
  await delay(200);
  tables = tables.map(t => {
    if (t.id === fromId) {
      return {
        ...t,
        status: "available",
        seatedAt: undefined,
        guestCount: undefined,
        orderTotal: undefined,
      };
    }
    if (t.id === toId) {
      return {
        ...t,
        status: "occupied",
        seatedAt: new Date().toISOString(),
        guestCount,
        orderTotal,
      };
    }
    return t;
  });
}

export async function createTable(
  payload: Omit<RestaurantTable, "id" | "status">
): Promise<RestaurantTable> {
  await delay(300);
  const newTable: RestaurantTable = {
    ...payload,
    id: `tbl-${Date.now()}`,
    status: "available",
  };
  tables = [...tables, newTable];
  return newTable;
}

export async function updateTable(
  id: string,
  payload: Partial<Omit<RestaurantTable, "id">>
): Promise<RestaurantTable> {
  await delay(250);
  tables = tables.map(t => (t.id === id ? { ...t, ...payload } : t));
  return tables.find(t => t.id === id)!;
}

export async function deleteTable(id: string): Promise<void> {
  await delay(200);
  tables = tables.filter(t => t.id !== id);
}

// ── Sections ──────────────────────────────────────────────────────────────────

export async function getSections(): Promise<RestaurantSection[]> {
  await delay(150);
  return [...sections];
}

export async function createSection(
  payload: Omit<RestaurantSection, "id">
): Promise<RestaurantSection> {
  await delay(250);
  const newSection: RestaurantSection = { ...payload, id: `sec-${Date.now()}` };
  sections = [...sections, newSection];
  return newSection;
}

export async function updateSection(
  id: string,
  payload: Partial<Omit<RestaurantSection, "id">>
): Promise<RestaurantSection> {
  await delay(200);
  sections = sections.map(s => (s.id === id ? { ...s, ...payload } : s));
  return sections.find(s => s.id === id)!;
}

export async function deleteSection(id: string): Promise<void> {
  await delay(200);
  sections = sections.filter(s => s.id !== id);
}

// ── Courses ───────────────────────────────────────────────────────────────────

export async function getCourses(): Promise<CourseType[]> {
  await delay(150);
  return [...courses].sort((a, b) => a.order - b.order);
}

export async function createCourse(
  payload: Omit<CourseType, "id">
): Promise<CourseType> {
  await delay(250);
  const newCourse: CourseType = { ...payload, id: `course-${Date.now()}` };
  courses = [...courses, newCourse];
  return newCourse;
}

export async function updateCourse(
  id: string,
  payload: Partial<Omit<CourseType, "id">>
): Promise<CourseType> {
  await delay(200);
  courses = courses.map(c => (c.id === id ? { ...c, ...payload } : c));
  return courses.find(c => c.id === id)!;
}

export async function deleteCourse(id: string): Promise<void> {
  await delay(200);
  courses = courses.filter(c => c.id !== id);
}
