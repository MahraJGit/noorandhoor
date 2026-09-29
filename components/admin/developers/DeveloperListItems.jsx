"use client";

import Link from "next/link";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import AdminButton from "@/components/admin/ui/AdminButton";

export function DeveloperTableRow({
  developer,
  orderNumber,
  canReorder,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onDelete,
}) {
  return (
    <tr
      draggable={canReorder}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`${isDragging ? "opacity-40" : ""} ${
        isDropTarget ? "bg-[#ba8a44]/10" : ""
      }`}
    >
      <td className="px-3 py-4">
        <div className="flex items-center gap-1 text-white/40">
          <span
            className={`inline-flex size-8 items-center justify-center rounded-lg ${
              canReorder
                ? "cursor-grab active:cursor-grabbing"
                : "cursor-default"
            }`}
            aria-hidden
          >
            <GripVertical className="h-4 w-4" />
          </span>
          <span className="w-5 text-xs tabular-nums">{orderNumber}</span>
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="font-medium text-white">
          {developer.developerName || developer.title || developer.name}
        </p>
      </td>
      <td className="px-5 py-4 text-white/70">{developer.title}</td>
      <td className="px-5 py-4 text-white/70">
        {[developer.pointOne, developer.pointTwo, developer.pointThree]
          .filter(Boolean)
          .join(" | ")}
      </td>
      <td className="px-5 py-4">
        <div className="flex justify-end gap-2">
          <Link href={`/admin/developers/${developer.id}/edit`}>
            <AdminButton size="icon" variant="ghost" aria-label="Edit developer">
              <Pencil className="h-4 w-4" />
            </AdminButton>
          </Link>
          <AdminButton
            size="icon"
            variant="danger"
            aria-label="Delete developer"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </AdminButton>
        </div>
      </td>
    </tr>
  );
}

export function DeveloperMobileCard({
  developer,
  orderNumber,
  canReorder,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onDelete,
}) {
  return (
    <article
      draggable={canReorder}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`rounded-2xl border border-white/8 bg-[#161616] p-4 ${
        isDragging ? "opacity-40" : ""
      } ${isDropTarget ? "border-[#ba8a44]/50 bg-[#ba8a44]/10" : ""}`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-white/40 ${
            canReorder
              ? "cursor-grab active:cursor-grabbing"
              : "cursor-default"
          }`}
          aria-hidden
        >
          <GripVertical className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-white/40">#{orderNumber}</p>
          <p className="font-medium text-white">
            {developer.developerName || developer.title || developer.name}
          </p>
          <p className="mt-1 text-xs text-white/55">{developer.title}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1 text-sm text-white/65">
        {[developer.pointOne, developer.pointTwo, developer.pointThree]
          .filter(Boolean)
          .map((point) => (
            <p key={point}>{point}</p>
          ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          href={`/admin/developers/${developer.id}/edit`}
          className="flex-1"
        >
          <AdminButton variant="secondary" className="w-full" size="sm">
            Edit
          </AdminButton>
        </Link>
        <AdminButton variant="danger" size="sm" onClick={onDelete}>
          Delete
        </AdminButton>
      </div>
    </article>
  );
}
