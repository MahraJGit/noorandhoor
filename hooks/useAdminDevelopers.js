"use client";

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import {
  createDeveloper,
  deleteDeveloper,
  getDevelopersServerSnapshot,
  getDevelopersSnapshot,
  loadDevelopers,
  reorderDevelopers,
  subscribeDevelopers,
  updateDeveloper,
} from "@/lib/admin/data/developers";

export default function useAdminDevelopers() {
  const developers = useSyncExternalStore(
    subscribeDevelopers,
    getDevelopersSnapshot,
    getDevelopersServerSnapshot,
  );
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    loadDevelopers()
      .catch((loadError) => {
        if (!cancelled) {
          setError(loadError?.message || "Could not load developers.");
        }
        return [];
      })
      .finally(() => {
        if (!cancelled) setIsReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const create = useCallback((payload) => createDeveloper(payload), []);
  const update = useCallback((id, payload) => updateDeveloper(id, payload), []);
  const remove = useCallback((id) => deleteDeveloper(id), []);
  const reorder = useCallback(
    (orderedIds) => reorderDevelopers(orderedIds),
    [],
  );

  return {
    developers: isReady ? developers : [],
    isReady,
    error,
    createDeveloper: create,
    updateDeveloper: update,
    deleteDeveloper: remove,
    reorderDevelopers: reorder,
  };
}
