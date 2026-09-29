import {
  CheckboxField,
  SelectField,
  TextField,
} from "@/components/admin/ui/Fields";
import DevelopersFields from "@/components/admin/properties/DevelopersFields";
import {
  CONSTRUCTION_STATUS_OPTIONS,
  ESCROW_TOOLTIP,
  FURNISHING_OPTIONS,
  SALE_STATUS_OPTIONS,
} from "@/lib/admin/propertyDetails";

export default function ProjectDetailsFields({ form, setField }) {
  return (
    <section className="space-y-5 rounded-2xl border border-white/8 bg-[#161616] p-5 sm:p-6">
      <div>
        <h2 className="text-sm font-semibold text-white">Project details</h2>
        <p className="mt-1 text-xs text-white/45">
          Specs shown in the Details grid on the public property page. Leave
          blank to hide a row.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="property-project-name"
          label="Project name"
          value={form.projectName}
          onChange={(event) => setField("projectName", event.target.value)}
          placeholder="Rabdan Avenue"
          hint="Defaults to listing title on the public page if empty"
        />
      </div>

      <DevelopersFields
        value={form.developers}
        onChange={(developers) => setField("developers", developers)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          id="property-construction-status"
          label="Construction status"
          value={form.constructionStatus}
          onChange={(event) =>
            setField("constructionStatus", event.target.value)
          }
          placeholder="Select status"
          options={CONSTRUCTION_STATUS_OPTIONS}
        />
        <SelectField
          id="property-sale-status"
          label="Sale status"
          value={form.saleStatus}
          onChange={(event) => setField("saleStatus", event.target.value)}
          placeholder="Select sale status"
          tooltip="Inventory sales status (EOI, Available, etc.). Separate from the listing visibility status in the sidebar."
          options={SALE_STATUS_OPTIONS}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          id="property-floors-formula"
          label="Floors formula"
          value={form.floorsFormula}
          onChange={(event) => setField("floorsFormula", event.target.value)}
          placeholder="B + G + 7floors + R"
        />
        <TextField
          id="property-handover"
          label="Handover"
          value={form.handover}
          onChange={(event) => setField("handover", event.target.value)}
          placeholder="Q1 2029"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <TextField
          id="property-readiness"
          label="Readiness progress (%)"
          type="number"
          min="0"
          max="100"
          value={form.readinessProgress}
          onChange={(event) =>
            setField("readinessProgress", event.target.value)
          }
        />
        <SelectField
          id="property-furnishing"
          label="Furnishing"
          value={form.furnishing}
          onChange={(event) => setField("furnishing", event.target.value)}
          placeholder="Select furnishing"
          options={FURNISHING_OPTIONS}
        />
        <TextField
          id="property-building-area"
          label="Total building area (sq ft)"
          type="number"
          min="0"
          step="0.01"
          value={form.totalBuildingArea}
          onChange={(event) =>
            setField("totalBuildingArea", event.target.value)
          }
          hint="Whole building — not the unit area above"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <CheckboxField
          id="property-is-branded"
          label="Branded project"
          checked={Boolean(form.isBranded)}
          onChange={(checked) => setField("isBranded", checked)}
          description="Mark if this is a branded residence."
        />
        <CheckboxField
          id="property-has-escrow"
          label="Has escrow"
          checked={Boolean(form.hasEscrow)}
          onChange={(checked) => setField("hasEscrow", checked)}
          description={ESCROW_TOOLTIP}
          tooltip={ESCROW_TOOLTIP}
        />
      </div>
    </section>
  );
}
