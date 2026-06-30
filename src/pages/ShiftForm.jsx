import { useNavigate, useParams } from "react-router-dom";
import Input, { Select } from "../components/ui/Input";
import NumericInput from "../components/ui/NumericInput";
import { FormLayout, FormSection, FormActions } from "../components/forms/FormLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";

const emptyShift = {
  name: "", startTime: "", endTime: "", graceTime: "", lateAfter: "", status: "active",
};

const shiftRules = {
  name: [validators.required, validators.minLength(2, "Shift name is required")],
  startTime: [validators.required, validators.time],
  endTime: [validators.required, validators.time],
  graceTime: [validators.required, validators.numeric, validators.min(0, "Cannot be negative"), validators.max(60, "Maximum 60 minutes")],
  lateAfter: [validators.required, validators.numeric, validators.min(1, "Minimum 1 minute"), validators.max(120, "Maximum 120 minutes")],
  status: [validators.required],
};

export default function ShiftForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shifts, createShift, updateShift } = useData();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  const existing = isEdit ? shifts.find((s) => s.id === Number(id)) : null;

  const { values, setValue, handleBlur, validateAll, resetForm, getFieldError } = useFormValidation(
    existing
      ? { ...existing, graceTime: String(existing.graceTime), lateAfter: String(existing.lateAfter) }
      : emptyShift,
    shiftRules
  );

  if (isEdit && !existing) {
    return <div className="text-center py-20 text-slate-500">Shift not found</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      addToast({ type: "error", title: "Validation failed", message: "Please fix the highlighted fields." });
      return;
    }

    const payload = {
      ...values,
      graceTime: parseInt(values.graceTime, 10),
      lateAfter: parseInt(values.lateAfter, 10),
    };

    try {
      if (isEdit) {
        await updateShift(existing.id, payload);
        addToast({ type: "success", title: "Shift updated" });
      } else {
        await createShift(payload);
        addToast({ type: "success", title: "Shift created" });
      }
      navigate("/shifts");
    } catch (err) {
      addToast({ type: "error", title: "Save failed", message: err.message });
    }
  };

  return (
    <FormLayout
      title={isEdit ? "Edit Shift" : "Add New Shift"}
      subtitle={isEdit ? `Updating ${existing.name}` : "Define work shift timings and late rules"}
      backTo="/shifts"
      breadcrumbs={
        <Breadcrumb items={[
          { label: "Shift Management", href: "/shifts" },
          { label: isEdit ? "Edit Shift" : "Add Shift" },
        ]} />
      }
      actions={
        <FormActions
          formId="shift-form"
          onCancel={() => navigate("/shifts")}
          onReset={() => resetForm(isEdit ? { ...existing, graceTime: String(existing.graceTime), lateAfter: String(existing.lateAfter) } : emptyShift)}
          saveLabel={isEdit ? "Update Shift" : "Create Shift"}
        />
      }
    >
      <form id="shift-form" onSubmit={handleSubmit}>
        <FormSection title="Shift Details">
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Shift Name" required placeholder="e.g. Morning Shift" value={values.name} error={getFieldError("name")} onChange={(e) => setValue("name", e.target.value)} onBlur={() => handleBlur("name")} />
            <Select label="Status" required options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} value={values.status} onChange={(e) => setValue("status", e.target.value)} />
          </div>
        </FormSection>

        <FormSection title="Timing" description="Define shift start and end times">
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Start Time" type="time" required value={values.startTime} error={getFieldError("startTime")} onChange={(e) => setValue("startTime", e.target.value)} onBlur={() => handleBlur("startTime")} />
            <Input label="End Time" type="time" required value={values.endTime} error={getFieldError("endTime")} onChange={(e) => setValue("endTime", e.target.value)} onBlur={() => handleBlur("endTime")} />
          </div>
        </FormSection>

        <FormSection title="Late Rules">
          <div className="grid md:grid-cols-2 gap-5">
            <NumericInput label="Grace Time (minutes)" required placeholder="10" value={values.graceTime} error={getFieldError("graceTime")} onChange={(e) => setValue("graceTime", e.target.value)} onBlur={() => handleBlur("graceTime")} helper="Minutes allowed before marking late (0–60)" />
            <NumericInput label="Late After (minutes)" required placeholder="15" value={values.lateAfter} error={getFieldError("lateAfter")} onChange={(e) => setValue("lateAfter", e.target.value)} onBlur={() => handleBlur("lateAfter")} helper="Mark as late after this many minutes (1–120)" />
          </div>
        </FormSection>
      </form>
    </FormLayout>
  );
}
