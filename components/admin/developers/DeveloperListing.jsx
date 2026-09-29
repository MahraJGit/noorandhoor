"use client";

import { useMemo, useState } from "react";
import AdminSplash from "@/components/admin/ui/AdminSplash";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import EmptyState from "@/components/admin/ui/EmptyState";
import PageHeader from "@/components/admin/ui/PageHeader";
import Pagination from "@/components/admin/ui/Pagination";
import SearchInput from "@/components/admin/ui/SearchInput";
import {
  DeveloperMobileCard,
  DeveloperTableRow,
} from "@/components/admin/developers/DeveloperListItems";
import { useToast } from "@/components/admin/providers/ToastProvider";
import useAdminDevelopers from "@/hooks/useAdminDevelopers";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { PAGE_SIZE } from "@/lib/admin/constants";

function moveItem(list, fromIndex, toIndex) {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export default function DeveloperListing() {
  const { developers, isReady, error, deleteDeveloper, reorderDevelopers } =
    useAdminDevelopers();
  const { showToast } = useToast();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const debouncedQuery = useDebouncedValue(query);
  const isSearching = Boolean(debouncedQuery.trim());
  const canReorder = !isSearching && !isSavingOrder;

  const filtered = useMemo(() => {
    const needle = debouncedQuery.trim().toLowerCase();

    return developers.filter((developer) => {
      const searchable = [
        developer.developerName,
        developer.title,
        developer.pointOne,
        developer.pointTwo,
        developer.pointThree,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return !needle || searchable.includes(needle);
    });
  }, [debouncedQuery, developers]);

  // Show the full list while reordering so items can move across former page boundaries.
  const totalPages = isSearching
    ? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    : 1;
  const currentPage = Math.min(page, totalPages);
  const pageStart = isSearching ? (currentPage - 1) * PAGE_SIZE : 0;
  const pageItems = isSearching
    ? filtered.slice(pageStart, pageStart + PAGE_SIZE)
    : filtered;

  const persistOrder = async (nextList) => {
    setIsSavingOrder(true);
    try {
      await reorderDevelopers(nextList.map((item) => item.id));
      showToast("Developer order updated.");
    } catch (saveError) {
      showToast(
        saveError?.message || "Could not save developer order.",
        "error",
      );
    } finally {
      setIsSavingOrder(false);
      setDraggingId(null);
      setDropTargetId(null);
    }
  };

  const onDropReorder = async (targetId) => {
    if (!canReorder || !draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDropTargetId(null);
      return;
    }

    const fromIndex = filtered.findIndex((item) => item.id === draggingId);
    const toIndex = filtered.findIndex((item) => item.id === targetId);
    if (fromIndex < 0 || toIndex < 0) {
      setDraggingId(null);
      setDropTargetId(null);
      return;
    }

    await persistOrder(moveItem(filtered, fromIndex, toIndex));
  };

  const dragHandlers = (developer) => ({
    onDragStart: (event) => {
      if (!canReorder) return;
      setDraggingId(developer.id);
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", developer.id);
    },
    onDragOver: (event) => {
      if (!canReorder || !draggingId) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      if (dropTargetId !== developer.id) setDropTargetId(developer.id);
    },
    onDragLeave: () => {
      if (dropTargetId === developer.id) setDropTargetId(null);
    },
    onDrop: (event) => {
      event.preventDefault();
      void onDropReorder(developer.id);
    },
    onDragEnd: () => {
      setDraggingId(null);
      setDropTargetId(null);
    },
  });

  if (!isReady) return <AdminSplash label="Loading developers" />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Partners"
        title="Developers"
        description="Manage trusted developer profiles and showcase them across the public site. Drag rows to set display order."
        actionLabel="Add developer"
        actionHref="/admin/developers/new"
      />

      <div className="rounded-2xl border border-white/8 bg-[#161616] p-4">
        <SearchInput
          value={query}
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          placeholder="Search developer or title"
        />
        {isSearching ? (
          <p className="mt-3 text-xs text-white/40">
            Clear search to drag and reorder developers.
          </p>
        ) : (
          <p className="mt-3 text-xs text-white/40">
            Drag any row to set who appears first, second, and so on. The full
            list is shown here so you can move items from the bottom to the top.
            {isSavingOrder ? " Saving order…" : ""}
          </p>
        )}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-200"
        >
          Could not load developers: {error}
        </p>
      ) : pageItems.length === 0 ? (
        <EmptyState
          title="No developers yet"
          description="Add your first developer profile to start managing partner listings."
          actionLabel="Add developer"
          actionHref="/admin/developers/new"
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-2xl border border-white/8 bg-[#161616] lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/8 text-xs uppercase tracking-[1.2px] text-white/45">
                <tr>
                  <th className="w-12 px-3 py-4 font-medium">#</th>
                  <th className="px-5 py-4 font-medium">Developer name</th>
                  <th className="px-5 py-4 font-medium">Title</th>
                  <th className="px-5 py-4 font-medium">Points</th>
                  <th className="px-5 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {pageItems.map((developer, index) => (
                  <DeveloperTableRow
                    key={developer.id}
                    developer={developer}
                    orderNumber={pageStart + index + 1}
                    canReorder={canReorder}
                    isDragging={draggingId === developer.id}
                    isDropTarget={dropTargetId === developer.id}
                    {...dragHandlers(developer)}
                    onDelete={() => setPendingDelete(developer)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {pageItems.map((developer, index) => (
              <DeveloperMobileCard
                key={developer.id}
                developer={developer}
                orderNumber={pageStart + index + 1}
                canReorder={canReorder}
                isDragging={draggingId === developer.id}
                isDropTarget={dropTargetId === developer.id}
                {...dragHandlers(developer)}
                onDelete={() => setPendingDelete(developer)}
              />
            ))}
          </div>

          {isSearching && totalPages > 1 ? (
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this developer?"
        description={`“${pendingDelete?.developerName || pendingDelete?.title || pendingDelete?.name || ""}” will be removed from the management list.`}
        confirmLabel="Delete"
        onClose={() => setPendingDelete(null)}
        onConfirm={async () => {
          try {
            await deleteDeveloper(pendingDelete.id);
            setPendingDelete(null);
            showToast("Developer deleted.");
          } catch (deleteError) {
            showToast(
              deleteError?.message || "Could not delete developer.",
              "error",
            );
          }
        }}
      />
    </div>
  );
}
