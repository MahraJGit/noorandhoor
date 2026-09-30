"use client";

import { useRef } from "react";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import AdminButton from "@/components/admin/ui/AdminButton";
import { MAX_COVER_IMAGE_BYTES } from "@/lib/admin/constants";
import {
  MAX_UNITS_PER_GROUP,
  nameFromBedrooms,
} from "@/lib/admin/propertyUnits";
import { fileToDataUrl } from "@/lib/admin/utils";

function UnitRowEditor({ unit, onChange, onRemove, onPickPlan }) {
  return (
    <div className="grid gap-3 rounded-xl border border-white/8 bg-[#111] p-3 sm:grid-cols-[7rem_minmax(0,1fr)_auto]">
      <button
        type="button"
        onClick={onPickPlan}
        className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-[#1a1a1a] text-white/40 transition hover:text-[#eec876]"
      >
        {unit.planImage ? (
          // Preview may be a data URL before upload.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={unit.planImage}
            alt={unit.unitNumber || "Floor plan"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <span className="inline-flex flex-col items-center gap-1 text-[10px]">
            <ImagePlus className="h-4 w-4" />
            Plan
          </span>
        )}
      </button>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <input
          type="text"
          value={unit.unitNumber}
          onChange={(event) => onChange({ unitNumber: event.target.value })}
          placeholder="Unit number"
          className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ba8a44]"
        />
        <input
          type="text"
          value={unit.unitKind}
          onChange={(event) => onChange({ unitKind: event.target.value })}
          placeholder="Type (Apartments)"
          className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ba8a44]"
        />
        <input
          type="text"
          value={unit.floor ?? ""}
          onChange={(event) => onChange({ floor: event.target.value })}
          placeholder="Floor"
          className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ba8a44]"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={unit.areaSqft}
          onChange={(event) => onChange({ areaSqft: event.target.value })}
          placeholder="Area sqft"
          className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ba8a44]"
        />
        <input
          type="number"
          min="0"
          step="1"
          value={unit.price}
          onChange={(event) => onChange({ price: event.target.value })}
          placeholder="Price From (AED)"
          className="rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#ba8a44] sm:col-span-2 lg:col-span-1"
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="inline-flex size-9 shrink-0 items-center justify-center self-start rounded-lg border border-white/10 text-white/50 transition hover:border-red-400/40 hover:text-red-300"
        aria-label="Remove unit"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function UnitTypeEditor({
  group,
  onChange,
  onRemove,
  onAddUnit,
}) {
  const fileInputRef = useRef(null);
  const replaceIndexRef = useRef(null);

  const updateUnit = (index, patch) => {
    onChange({
      units: group.units.map((unit, i) =>
        i === index ? { ...unit, ...patch } : unit,
      ),
    });
  };

  const removeUnit = (index) => {
    onChange({ units: group.units.filter((_, i) => i !== index) });
  };

  const pickPlan = (index) => {
    replaceIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const onFileChange = async (event) => {
    const file = event.target.files?.[0];
    const index = replaceIndexRef.current;
    event.target.value = "";
    replaceIndexRef.current = null;
    if (!file || index == null) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > MAX_COVER_IMAGE_BYTES) return;
    const dataUrl = await fileToDataUrl(file);
    updateUnit(index, { planImage: dataUrl });
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-[#111] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <input
            type="color"
            value={group.accentColor || "#22c55e"}
            onChange={(event) => onChange({ accentColor: event.target.value })}
            className="h-10 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1"
            aria-label="Accent color"
          />
          <input
            type="text"
            value={group.name}
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder="1 Bedroom"
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm font-medium text-white outline-none placeholder:text-white/35 focus:border-[#ba8a44]"
          />
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 text-white/50 transition hover:border-red-400/40 hover:text-red-300"
          aria-label="Remove unit type"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-xs text-white/50">
          Bedrooms
          <input
            type="number"
            min="0"
            value={group.bedrooms ?? ""}
            onChange={(event) => {
              const bedrooms = event.target.value;
              const syncedName = nameFromBedrooms(bedrooms);
              onChange({
                bedrooms,
                ...(syncedName ? { name: syncedName } : {}),
              });
            }}
            placeholder="—"
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none focus:border-[#ba8a44]"
          />
          <span className="mt-1 block text-[11px] text-white/35">
            Public title uses this (e.g. 4 Bedrooms). Leave empty for Retail.
          </span>
        </label>
        <label className="space-y-1 text-xs text-white/50">
          Inventory count
          <input
            type="number"
            min="0"
            value={group.inventoryCount}
            onChange={(event) =>
              onChange({ inventoryCount: event.target.value })
            }
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none focus:border-[#ba8a44]"
          />
        </label>
        <label className="space-y-1 text-xs text-white/50">
          Parking per this type
          <input
            type="number"
            min="0"
            value={group.parkingSpaces}
            onChange={(event) =>
              onChange({ parkingSpaces: event.target.value })
            }
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#161616] px-3 py-2 text-sm text-white outline-none focus:border-[#ba8a44]"
          />
          <span className="mt-1 block text-[11px] text-white/35">
            Shows on “Parking per unit type” (e.g. 2 = 2 Parkings).
          </span>
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[1.4px] text-white/55">
            Layout / unit rows
          </p>
          <AdminButton
            type="button"
            variant="secondary"
            onClick={onAddUnit}
            disabled={group.units.length >= MAX_UNITS_PER_GROUP}
            className="gap-1.5 px-3 py-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            Add unit
          </AdminButton>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileChange}
        />

        {group.units.length ? (
          <div className="space-y-3">
            {group.units.map((unit, index) => (
              <UnitRowEditor
                key={unit.clientKey || unit.id || `unit-${index}`}
                unit={unit}
                onChange={(patch) => updateUnit(index, patch)}
                onRemove={() => removeUnit(index)}
                onPickPlan={() => pickPlan(index)}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 px-3 py-5 text-center text-xs text-white/40">
            No layout rows yet. Inventory count still shows on the public page.
          </p>
        )}
      </div>
    </div>
  );
}
