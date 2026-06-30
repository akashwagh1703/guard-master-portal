import { useNavigate, useParams } from "react-router-dom";
import Input, { Select } from "../components/ui/Input";
import NumericInput from "../components/ui/NumericInput";
import { FormLayout, FormSection, FormActions } from "../components/forms/FormLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";

const emptySite = {
  name: "", client: "", contact: "", phone: "", address: "",
  lat: "", lng: "", radius: "", status: "active",
};

const siteRules = {
  name: [validators.required, validators.minLength(2, "Site name must be at least 2 characters")],
  client: [validators.required, validators.minLength(2, "Client name is required")],
  contact: [validators.minLength(2, "Contact name must be at least 2 characters")],
  phone: [validators.phone],
  address: [validators.required, validators.minLength(5, "Enter a complete address")],
  lat: [validators.required, validators.latitude],
  lng: [validators.required, validators.longitude],
  radius: [validators.required, validators.numeric, validators.min(10, "Minimum radius is 10 meters"), validators.max(5000, "Maximum radius is 5000 meters")],
  status: [validators.required],
};

export default function SiteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sites, createSite, updateSite } = useData();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  const existing = isEdit ? sites.find((s) => s.id === Number(id)) : null;

  const { values, setValue, handleBlur, validateAll, resetForm, getFieldError } = useFormValidation(
    existing
      ? { ...existing, lat: String(existing.lat), lng: String(existing.lng), radius: String(existing.radius) }
      : emptySite,
    siteRules
  );

  if (isEdit && !existing) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Site not found</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      addToast({ type: "error", title: "Validation failed", message: "Please fix the highlighted fields." });
      return;
    }

    const payload = {
      ...values,
      lat: parseFloat(values.lat),
      lng: parseFloat(values.lng),
      radius: parseInt(values.radius, 10),
    };

    try {
      if (isEdit) {
        await updateSite(existing.id, payload);
        addToast({ type: "success", title: "Site updated", message: `${values.name} has been updated.` });
      } else {
        await createSite(payload);
        addToast({ type: "success", title: "Site created", message: `${values.name} has been added.` });
      }
      navigate("/sites");
    } catch (err) {
      addToast({ type: "error", title: "Save failed", message: err.message });
    }
  };

  return (
    <FormLayout
      title={isEdit ? "Edit Site" : "Add New Site"}
      subtitle={isEdit ? `Updating ${existing.name}` : "Register a new client site with geofence settings"}
      backTo="/sites"
      breadcrumbs={
        <Breadcrumb items={[
          { label: "Site Management", href: "/sites" },
          { label: isEdit ? "Edit Site" : "Add Site" },
        ]} />
      }
      actions={
        <FormActions
          formId="site-form"
          onCancel={() => navigate("/sites")}
          onReset={() => resetForm(isEdit ? { ...existing, lat: String(existing.lat), lng: String(existing.lng), radius: String(existing.radius) } : emptySite)}
          saveLabel={isEdit ? "Update Site" : "Create Site"}
        />
      }
    >
      <form id="site-form" onSubmit={handleSubmit}>
        <FormSection title="Basic Information" description="Site and client details">
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Site Name" required placeholder="e.g. Tech Park Tower A" value={values.name} error={getFieldError("name")} onChange={(e) => setValue("name", e.target.value)} onBlur={() => handleBlur("name")} />
            <Input label="Client Name" required placeholder="e.g. Infosys Ltd" value={values.client} error={getFieldError("client")} onChange={(e) => setValue("client", e.target.value)} onBlur={() => handleBlur("client")} />
            <Input label="Contact Person" placeholder="Primary contact name" value={values.contact} error={getFieldError("contact")} onChange={(e) => setValue("contact", e.target.value)} onBlur={() => handleBlur("contact")} />
            <Input label="Phone" placeholder="+91 98765 43210" value={values.phone} error={getFieldError("phone")} onChange={(e) => setValue("phone", e.target.value)} onBlur={() => handleBlur("phone")} helper="10–15 digits, optional + prefix" />
            <Input label="Address" required className="md:col-span-2" placeholder="Full street address" value={values.address} error={getFieldError("address")} onChange={(e) => setValue("address", e.target.value)} onBlur={() => handleBlur("address")} />
          </div>
        </FormSection>

        <FormSection title="Location & Geofence" description="GPS coordinates and attendance radius">
          <div className="grid md:grid-cols-3 gap-5">
            <NumericInput label="Latitude" required placeholder="12.9716" allowDecimal allowNegative value={values.lat} error={getFieldError("lat")} onChange={(e) => setValue("lat", e.target.value)} onBlur={() => handleBlur("lat")} helper="-90 to 90" />
            <NumericInput label="Longitude" required placeholder="77.5946" allowDecimal allowNegative value={values.lng} error={getFieldError("lng")} onChange={(e) => setValue("lng", e.target.value)} onBlur={() => handleBlur("lng")} helper="-180 to 180" />
            <NumericInput label="Attendance Radius (m)" required placeholder="100" value={values.radius} error={getFieldError("radius")} onChange={(e) => setValue("radius", e.target.value)} onBlur={() => handleBlur("radius")} helper="10 – 5000 meters" />
          </div>
        </FormSection>

        <FormSection title="Status">
          <div className="max-w-xs">
            <Select label="Status" required options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} value={values.status} error={getFieldError("status")} onChange={(e) => setValue("status", e.target.value)} onBlur={() => handleBlur("status")} />
          </div>
        </FormSection>
      </form>
    </FormLayout>
  );
}
