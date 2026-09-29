import { formatDisplayDate } from "@/lib/admin/utils";
import { developersDisplayName } from "@/lib/admin/propertyDevelopers";

export const UNIT_TYPE_OPTIONS = [
  "Apartments",
  "Duplex",
  "Studios",
  "Villas",
  "Townhouses",
  "Penthouses",
  "Commercial",
];

export const CONSTRUCTION_STATUS_OPTIONS = [
  { value: "Not Started", label: "Not Started" },
  { value: "Under Construction", label: "Under Construction" },
  { value: "Completed", label: "Completed" },
  { value: "On Hold", label: "On Hold" },
];

export const SALE_STATUS_OPTIONS = [
  { value: "EOI", label: "EOI" },
  { value: "Available", label: "Available" },
  { value: "Coming Soon", label: "Coming Soon" },
  { value: "Sold Out", label: "Sold Out" },
  { value: "On Hold", label: "On Hold" },
];

export const FURNISHING_OPTIONS = [
  { value: "Unfurnished", label: "Unfurnished" },
  { value: "Semi furnished", label: "Semi furnished" },
  { value: "Fully furnished", label: "Fully furnished" },
];

export const ESCROW_TOOLTIP =
  "Escrow accounts hold buyer payments with a bank until project milestones are met, protecting funds under UAE off-plan regulations.";

export const DEFAULT_PROJECT_DETAILS = {
  projectName: "",
  developer: "",
  isBranded: false,
  unitTypes: [],
  constructionStatus: "",
  saleStatus: "",
  floorsFormula: "",
  handover: "",
  readinessProgress: 0,
  furnishing: "",
  totalBuildingArea: "",
  hasEscrow: false,
};

function clampProgress(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(100, Math.max(0, Math.round(parsed)));
}

export function normalizeUnitTypes(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }
  return String(value || "")
    .split(/[,|\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeProjectDetails(payload = {}) {
  const totalBuildingArea =
    payload.totalBuildingArea === "" || payload.totalBuildingArea == null
      ? ""
      : Number(payload.totalBuildingArea);

  return {
    projectName: String(payload.projectName || "").trim(),
    developer: String(payload.developer || "").trim(),
    isBranded: Boolean(payload.isBranded),
    unitTypes: normalizeUnitTypes(payload.unitTypes),
    constructionStatus: String(payload.constructionStatus || "").trim(),
    saleStatus: String(payload.saleStatus || "").trim(),
    floorsFormula: String(payload.floorsFormula || "").trim(),
    handover: String(payload.handover || "").trim(),
    readinessProgress: clampProgress(payload.readinessProgress),
    furnishing: String(payload.furnishing || "").trim(),
    totalBuildingArea:
      totalBuildingArea === "" || !Number.isFinite(totalBuildingArea)
        ? ""
        : totalBuildingArea,
    hasEscrow: Boolean(payload.hasEscrow),
  };
}

export function projectDetailsFromRow(row) {
  return normalizeProjectDetails({
    projectName: row.project_name,
    developer: row.developer,
    isBranded: row.is_branded,
    unitTypes: row.unit_types,
    constructionStatus: row.construction_status,
    saleStatus: row.sale_status,
    floorsFormula: row.floors_formula,
    handover: row.handover,
    readinessProgress: row.readiness_progress,
    furnishing: row.furnishing,
    totalBuildingArea: row.total_building_area,
    hasEscrow: row.has_escrow,
  });
}

export function projectDetailsToRow(details) {
  const normalized = normalizeProjectDetails(details);
  return {
    project_name: normalized.projectName,
    developer: normalized.developer,
    is_branded: normalized.isBranded,
    unit_types: normalized.unitTypes,
    construction_status: normalized.constructionStatus,
    sale_status: normalized.saleStatus,
    floors_formula: normalized.floorsFormula,
    handover: normalized.handover,
    readiness_progress: normalized.readinessProgress,
    furnishing: normalized.furnishing,
    total_building_area:
      normalized.totalBuildingArea === "" ? null : normalized.totalBuildingArea,
    has_escrow: normalized.hasEscrow,
  };
}

export function projectDetailsToForm(details = {}) {
  const normalized = normalizeProjectDetails(details);
  return {
    projectName: normalized.projectName,
    developer: normalized.developer,
    isBranded: normalized.isBranded,
    unitTypes: normalized.unitTypes,
    constructionStatus: normalized.constructionStatus,
    saleStatus: normalized.saleStatus,
    floorsFormula: normalized.floorsFormula,
    handover: normalized.handover,
    readinessProgress: String(normalized.readinessProgress ?? 0),
    furnishing: normalized.furnishing,
    totalBuildingArea:
      normalized.totalBuildingArea === ""
        ? ""
        : String(normalized.totalBuildingArea),
    hasEscrow: normalized.hasEscrow,
  };
}

function formatArea(value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "";
  return `${number.toLocaleString("en-AE", {
    maximumFractionDigits: 2,
  })} sqft`;
}

function formatYesNo(value) {
  return value ? "Yes" : "No";
}

/**
 * Ordered rows for the public Details grid.
 * Omits empty optional values so incomplete listings stay clean.
 */
export function buildProjectDetailRows(property) {
  if (!property) return [];

  const developerLabel = developersDisplayName(
    property.developers,
    property.developer,
  );

  const rows = [
    {
      label: "Project Name",
      value: property.projectName || property.title || "",
    },
    {
      label: "Branded Project?",
      value:
        property.projectName || developerLabel
          ? formatYesNo(Boolean(property.isBranded))
          : "",
    },
    {
      label: "Construction Status",
      value: property.constructionStatus || "",
    },
    { label: "Sale Status", value: property.saleStatus || "" },
    {
      label: "Added On",
      value: property.listedAt ? formatDisplayDate(property.listedAt) : "",
    },
    { label: "Floors Formula", value: property.floorsFormula || "" },
    { label: "Handover", value: property.handover || "" },
    {
      label: "Readiness progress",
      value:
        property.readinessProgress != null && property.readinessProgress !== ""
          ? `${Number(property.readinessProgress)}%`
          : "",
    },
    { label: "Furnishing", value: property.furnishing || "" },
    {
      label: "Total Building Area",
      value: formatArea(property.totalBuildingArea),
    },
    {
      label: "Has Escrow",
      value:
        property.hasEscrow != null &&
        (property.projectName ||
          developerLabel ||
          property.saleStatus ||
          property.constructionStatus)
          ? formatYesNo(Boolean(property.hasEscrow))
          : property.hasEscrow
            ? "Yes"
            : "",
      hint: property.hasEscrow ? ESCROW_TOOLTIP : "",
    },
  ];

  return rows.filter((row) => Boolean(row.value));
}

export function hasProjectDetails(property) {
  return buildProjectDetailRows(property).length > 0;
}
