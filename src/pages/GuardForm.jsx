import { useNavigate, useParams } from "react-router-dom";
import Input, { Select } from "../components/ui/Input";
import NumericInput from "../components/ui/NumericInput";
import { ImageUpload } from "../components/ui/FileUpload";
import { FormLayout, FormSection, FormActions } from "../components/forms/FormLayout";
import Breadcrumb from "../components/ui/Breadcrumb";
import { useToast } from "../components/ui/Toast";
import { useData } from "../context/DataContext";
import useFormValidation from "../hooks/useFormValidation";
import { validators } from "../utils/validation";

const emptyGuard = {
  name: "", mobile: "", email: "", address: "", joiningDate: "",
  salary: "", overtimeRate: "", username: "", status: "active",
};

const guardRules = {
  name: [validators.required, validators.minLength(2, "Name must be at least 2 characters")],
  mobile: [validators.required, validators.phone],
  email: [validators.email],
  address: [validators.minLength(5, "Enter a complete address")],
  joiningDate: [validators.required],
  salary: [validators.required, validators.numeric, validators.min(1, "Salary must be greater than 0")],
  overtimeRate: [validators.required, validators.numeric, validators.min(1, "Rate must be greater than 0")],
  username: [validators.required, validators.minLength(3, "Username must be at least 3 characters")],
  status: [validators.required],
};

export default function GuardForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { guards, createGuard, updateGuard } = useData();
  const { addToast } = useToast();
  const isEdit = Boolean(id);
  const existing = isEdit ? guards.find((g) => g.id === Number(id)) : null;

  const { values, setValue, handleBlur, validateAll, resetForm, getFieldError } = useFormValidation(
    existing
      ? { ...existing, salary: String(existing.salary), overtimeRate: String(existing.overtimeRate) }
      : emptyGuard,
    guardRules
  );

  if (isEdit && !existing) {
    return <div className="text-center py-20 text-slate-500">Guard not found</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      addToast({ type: "error", title: "Validation failed", message: "Please fix the highlighted fields." });
      return;
    }

    const payload = {
      ...values,
      salary: parseInt(values.salary, 10),
      overtimeRate: parseInt(values.overtimeRate, 10),
    };

    try {
      if (isEdit) {
        await updateGuard(existing.id, payload);
        addToast({ type: "success", title: "Guard updated" });
        navigate(`/guards/${existing.id}`);
      } else {
        const newGuard = await createGuard({ ...payload, employeeId: `SG-${String(guards.length + 1).padStart(3, "0")}` });
        addToast({ type: "success", title: "Guard added" });
        navigate(`/guards/${newGuard.id}`);
      }
    } catch (err) {
      addToast({ type: "error", title: "Save failed", message: err.message });
    }
  };

  return (
    <FormLayout
      title={isEdit ? "Edit Guard" : "Add New Guard"}
      subtitle={isEdit ? `Updating ${existing.name}` : "Register a new security guard profile"}
      backTo={isEdit ? `/guards/${id}` : "/guards"}
      breadcrumbs={
        <Breadcrumb items={[
          { label: "Security Guards", href: "/guards" },
          { label: isEdit ? "Edit Guard" : "Add Guard" },
        ]} />
      }
      actions={
        <FormActions
          formId="guard-form"
          onCancel={() => navigate(isEdit ? `/guards/${id}` : "/guards")}
          onReset={() => resetForm(isEdit ? { ...existing, salary: String(existing.salary), overtimeRate: String(existing.overtimeRate) } : emptyGuard)}
          saveLabel={isEdit ? "Update Guard" : "Create Guard"}
        />
      }
    >
      <form id="guard-form" onSubmit={handleSubmit}>
        <FormSection title="Profile Photo">
          <ImageUpload label="Guard Photo" helper="JPG or PNG, max 2MB" />
        </FormSection>

        <FormSection title="Personal Information">
          <div className="grid md:grid-cols-2 gap-5">
            <Input label="Full Name" required placeholder="Enter full name" value={values.name} error={getFieldError("name")} onChange={(e) => setValue("name", e.target.value)} onBlur={() => handleBlur("name")} />
            <Input label="Mobile" required placeholder="+91 98765 43210" value={values.mobile} error={getFieldError("mobile")} onChange={(e) => setValue("mobile", e.target.value)} onBlur={() => handleBlur("mobile")} />
            <Input label="Email" type="email" placeholder="guard@secureguard.com" value={values.email} error={getFieldError("email")} onChange={(e) => setValue("email", e.target.value)} onBlur={() => handleBlur("email")} />
            <Input label="Address" placeholder="Residential address" value={values.address} error={getFieldError("address")} onChange={(e) => setValue("address", e.target.value)} onBlur={() => handleBlur("address")} />
            <Input label="Joining Date" type="date" required value={values.joiningDate} error={getFieldError("joiningDate")} onChange={(e) => setValue("joiningDate", e.target.value)} onBlur={() => handleBlur("joiningDate")} />
            <Input label="Username" required placeholder="login username" value={values.username} error={getFieldError("username")} onChange={(e) => setValue("username", e.target.value)} onBlur={() => handleBlur("username")} helper="Used for guard app login" />
          </div>
        </FormSection>

        <FormSection title="Compensation">
          <div className="grid md:grid-cols-2 gap-5">
            <NumericInput label="Monthly Salary (₹)" required placeholder="18000" value={values.salary} error={getFieldError("salary")} onChange={(e) => setValue("salary", e.target.value)} onBlur={() => handleBlur("salary")} />
            <NumericInput label="Overtime Rate (₹/hr)" required placeholder="150" value={values.overtimeRate} error={getFieldError("overtimeRate")} onChange={(e) => setValue("overtimeRate", e.target.value)} onBlur={() => handleBlur("overtimeRate")} />
          </div>
        </FormSection>

        <FormSection title="Employment Status">
          <div className="max-w-xs">
            <Select label="Status" required options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} value={values.status} onChange={(e) => setValue("status", e.target.value)} />
          </div>
        </FormSection>
      </form>
    </FormLayout>
  );
}
