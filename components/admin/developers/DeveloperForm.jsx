"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import AdminButton from "@/components/admin/ui/AdminButton";
import ImageUploader from "@/components/admin/ui/ImageUploader";
import { TextField } from "@/components/admin/ui/Fields";
import PageHeader from "@/components/admin/ui/PageHeader";
import { useToast } from "@/components/admin/providers/ToastProvider";
import useAdminDevelopers from "@/hooks/useAdminDevelopers";

const DEFAULT_FORM = {
  developerName: "",
  title: "",
  image: "",
  pointOne: "Active Master Communities",
  pointTwo: "Delivery Record (29,930)",
  pointThree: "Starting Price",
};

function buildFormFromDeveloper(existingDeveloper) {
  if (!existingDeveloper) return DEFAULT_FORM;

  return {
    developerName:
      existingDeveloper.developerName ||
      (existingDeveloper.title ? "" : existingDeveloper.name || ""),
    title: existingDeveloper.title || existingDeveloper.name || "",
    image: existingDeveloper.imagePath || "",
    pointOne: existingDeveloper.pointOne || "Active Master Communities",
    pointTwo: existingDeveloper.pointTwo || "Delivery Record (29,930)",
    pointThree: existingDeveloper.pointThree || "Starting Price",
  };
}

export default function DeveloperForm({ developerId }) {
  const {
    developers,
    isReady,
    error,
    createDeveloper,
    updateDeveloper,
  } = useAdminDevelopers();
  const existingDeveloper = developers.find(
    (developer) => String(developer.id) === String(developerId),
  );

  if (!isReady) {
    return <p className="py-10 text-center text-sm text-white/50">Loading developer...</p>;
  }
  if (error) {
    return (
      <p role="alert" className="py-10 text-center text-sm text-red-200">
        Could not load developers: {error}
      </p>
    );
  }
  if (developerId && !existingDeveloper) {
    return <p className="py-10 text-center text-sm text-white/50">Developer not found.</p>;
  }

  return (
    <DeveloperFormContent
      key={developerId || "new-developer"}
      developerId={developerId}
      existingDeveloper={existingDeveloper}
      createDeveloper={createDeveloper}
      updateDeveloper={updateDeveloper}
    />
  );
}

function DeveloperFormContent({
  developerId,
  existingDeveloper,
  createDeveloper,
  updateDeveloper,
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState(() => buildFormFromDeveloper(existingDeveloper));
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(developerId);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = { ...form };

      if (isEdit) {
        await updateDeveloper(developerId, payload);
        showToast("Developer updated.");
      } else {
        await createDeveloper(payload);
        showToast("Developer created.");
      }

      router.push("/admin/developers");
    } catch (error) {
      showToast(error?.message || "Could not save developer.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/admin/developers"
          className="inline-flex items-center gap-2 text-sm text-[#eec876] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to developers
        </Link>
      </div>

      <PageHeader
        eyebrow={isEdit ? "Update" : "Create"}
        title={isEdit ? "Edit developer" : "Add developer"}
        description="Add the developer card content shown on the public frontend."
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-white/8 bg-[#161616] p-5 sm:p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <TextField
            id="developer-name"
            label="Developer name"
            value={form.developerName}
            onChange={(event) => updateField("developerName", event.target.value)}
            placeholder="Emaar Properties"
            required
          />

          <TextField
            id="developer-title"
            label="Title"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="Emaar Properties"
            required
          />

          <div className="md:col-span-2">
            <ImageUploader
              label="Background image"
              value={form.image}
              onChange={(value) => updateField("image", value)}
              storageBucket="developer-images"
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-medium text-white">Points</h3>
            <div className="grid grid-cols-1 gap-5">
              <TextField
                id="developer-point-one"
                aria-label="First developer point"
                value={form.pointOne}
                onChange={(event) => updateField("pointOne", event.target.value)}
                placeholder="Active Master Communities"
              />

              <TextField
                id="developer-point-two"
                aria-label="Second developer point"
                value={form.pointTwo}
                onChange={(event) => updateField("pointTwo", event.target.value)}
                placeholder="Delivery Record (29,930)"
              />

              <TextField
                id="developer-point-three"
                aria-label="Third developer point"
                value={form.pointThree}
                onChange={(event) => updateField("pointThree", event.target.value)}
                placeholder="Starting Price"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/developers">
            <AdminButton variant="secondary" type="button">
              Cancel
            </AdminButton>
          </Link>
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Update developer" : "Create developer"}
          </AdminButton>
        </div>
      </form>
    </div>
  );
}
