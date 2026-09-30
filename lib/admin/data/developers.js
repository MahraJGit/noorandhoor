import { createClient } from "@/lib/supabase/client";

const TABLE = "developers";
const IMAGE_BUCKET = "developer-images";
const EMPTY = [];
const DEVELOPER_COLUMNS =
  "id, developer_name, title, image_path, point_one, point_two, point_three, sort_order, created_at, updated_at";

let listeners = new Set();
let snapshot = EMPTY;
let client;

function getClient() {
  client ??= createClient();
  return client;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function setSnapshot(next) {
  snapshot = next;
  emit();
  return snapshot;
}

function fromDatabase(row) {
  const imagePath = row.image_path || "";
  const image = imagePath
    ? getClient().storage.from(IMAGE_BUCKET).getPublicUrl(imagePath).data
        .publicUrl
    : "";

  return {
    id: row.id,
    developerName: row.developer_name,
    title: row.title,
    imagePath,
    image,
    pointOne: row.point_one,
    pointTwo: row.point_two,
    pointThree: row.point_three,
    sortOrder: Number(row.sort_order ?? 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toDatabase(payload) {
  const row = {
    developer_name: String(payload.developerName || "").trim(),
    title: String(payload.title || "").trim(),
    image_path: String(payload.imagePath || payload.image || "").trim() || null,
    point_one: String(payload.pointOne || "").trim(),
    point_two: String(payload.pointTwo || "").trim(),
    point_three: String(payload.pointThree || "").trim(),
    updated_at: new Date().toISOString(),
  };

  if (payload.sortOrder != null && payload.sortOrder !== "") {
    row.sort_order = Number(payload.sortOrder) || 0;
  }

  return row;
}

function throwOnError(error) {
  if (error) throw new Error(error.message || "Developer request failed.");
}

function sortByOrder(list) {
  return [...list].sort(
    (a, b) =>
      Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0) ||
      String(a.developerName || "").localeCompare(String(b.developerName || "")),
  );
}

export function subscribeDevelopers(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDevelopersSnapshot() {
  return snapshot;
}

export function getDevelopersServerSnapshot() {
  return EMPTY;
}

export async function loadDevelopers() {
  if (typeof window === "undefined") return EMPTY;

  const { data, error } = await getClient()
    .from(TABLE)
    .select(DEVELOPER_COLUMNS)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  throwOnError(error);
  return setSnapshot(sortByOrder((data || []).map(fromDatabase)));
}

export function getDevelopers() {
  return snapshot;
}

export async function createDeveloper(payload) {
  const nextOrder =
    snapshot.reduce(
      (max, item) => Math.max(max, Number(item.sortOrder ?? 0)),
      -1,
    ) + 1;

  const { data, error } = await getClient()
    .from(TABLE)
    .insert(toDatabase({ ...payload, sortOrder: nextOrder }))
    .select(DEVELOPER_COLUMNS)
    .single();

  throwOnError(error);
  const created = fromDatabase(data);
  setSnapshot(sortByOrder([...snapshot, created]));
  return created;
}

export async function updateDeveloper(id, payload) {
  const { data, error } = await getClient()
    .from(TABLE)
    .update(toDatabase(payload))
    .eq("id", id)
    .select(DEVELOPER_COLUMNS)
    .single();

  throwOnError(error);
  const updated = fromDatabase(data);
  setSnapshot(
    sortByOrder(
      snapshot.map((developer) =>
        developer.id === id ? updated : developer,
      ),
    ),
  );
  return updated;
}

export async function deleteDeveloper(id) {
  const { error } = await getClient().from(TABLE).delete().eq("id", id);
  throwOnError(error);
  setSnapshot(snapshot.filter((developer) => developer.id !== id));
}

/**
 * Persist a new display order. `orderedIds` is the full catalog order (first = shown first).
 */
export async function reorderDevelopers(orderedIds) {
  const ids = (orderedIds || []).map(String).filter(Boolean);
  if (!ids.length) return snapshot;

  const byId = new Map(snapshot.map((item) => [String(item.id), item]));
  const ordered = ids
    .map((id) => byId.get(id))
    .filter(Boolean)
    .map((item, index) => ({ ...item, sortOrder: index }));

  // Keep any developers missing from the payload at the end.
  snapshot.forEach((item) => {
    if (!ids.includes(String(item.id))) {
      ordered.push({ ...item, sortOrder: ordered.length });
    }
  });

  setSnapshot(ordered);

  const client = getClient();
  const results = await Promise.all(
    ordered.map((item) =>
      client
        .from(TABLE)
        .update({
          sort_order: item.sortOrder,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id),
    ),
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    await loadDevelopers();
    throwOnError(failed.error);
  }

  return ordered;
}
