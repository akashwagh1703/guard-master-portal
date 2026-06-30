import { Upload, Camera } from "lucide-react";
import { cn } from "../../utils/cn";

export default function FileUpload({ label, accept, onChange, helper, className }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
        <Upload className="h-8 w-8 text-slate-400 mb-2" />
        <span className="text-sm text-slate-500">Click to upload or drag and drop</span>
        <input type="file" accept={accept} onChange={onChange} className="hidden" />
      </label>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

export function ImageUpload({ label, preview, onChange, helper }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-700">{label}</label>}
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <Camera className="h-8 w-8 text-slate-400" />
          )}
        </div>
        <label className="px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg cursor-pointer hover:bg-primary/5 transition-colors">
          Choose Image
          <input type="file" accept="image/*" onChange={onChange} className="hidden" />
        </label>
      </div>
      {helper && <p className="text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

export function CameraPreview({ className }) {
  return (
    <div className={cn("aspect-video bg-slate-900 rounded-xl flex items-center justify-center", className)}>
      <div className="text-center">
        <Camera className="h-12 w-12 text-slate-500 mx-auto mb-2" />
        <p className="text-sm text-slate-400">Camera preview placeholder</p>
      </div>
    </div>
  );
}
