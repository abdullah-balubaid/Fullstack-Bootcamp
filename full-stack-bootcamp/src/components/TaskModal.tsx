import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Crescent from "../assets/Crescent.svg";
import type { TaskCardProps } from "./TaskCard";

// ✅ Added onUpdate and onDelete to the props
type TaskModalProps = TaskCardProps & {
  open: boolean;
  onClose: () => void;
  onToggleCompleted?: () => void;
  onUpdate?: (changes: Partial<TaskCardProps>) => void;
  onDelete?: () => void;
  totalCrescents?: number;
};

const TaskModal = ({
  open, onClose, onToggleCompleted, onUpdate, onDelete,
  title, description, date,
  activeCrescents = 0, totalCrescents = 5,
  summary = [], volunteersNeeded,
  completed = false, completedOn,
}: TaskModalProps) => {

  // ✅ Added state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editCrescents, setEditCrescents] = useState(activeCrescents);
  const [editVolunteers, setEditVolunteers] = useState(volunteersNeeded || "");

  // ✅ Reset edit state if modal opens/closes or props change
  useEffect(() => {
    if (open) {
      setIsEditing(false);
      setEditTitle(title);
      setEditDescription(description);
      setEditCrescents(activeCrescents);
      setEditVolunteers(volunteersNeeded || "");
    }
  }, [open, title, description, activeCrescents, volunteersNeeded]);

  // ✅ Close or cancel edit on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isEditing) setIsEditing(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, isEditing, onClose]);

  const handleSave = () => {
    onUpdate?.({
      title: editTitle,
      description: editDescription,
      activeCrescents: editCrescents,
      volunteersNeeded: editVolunteers ? Number(editVolunteers) : undefined,
    });
    setIsEditing(false);
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md bg-(--panel-deep) rounded-2xl overflow-hidden ${
          completed
            ? "border border-(--gold-cream) shadow-[0_0_40px_8px_rgba(212,175,55,0.22)]"
            : "border border-(--gold-cream)/50 shadow-[0_0_40px_6px_rgba(212,175,55,0.15)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--gold-cream)/20">
          <h2 className="flex-1 text-center font-bold text-(--gold-cream) text-sm tracking-[0.15em] uppercase">
            {isEditing ? "Edit Task" : `${title} Details`}
          </h2>
          <div className="flex gap-2">
            {/* ✅ Edit / Save Button */}
            {!completed && (
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="px-3 h-8 flex items-center justify-center rounded-full text-xs font-bold border border-[#FFF1AA]/40 text-[#FFF1AA]/80 hover:border-[#FFF1AA] hover:text-[#FFF1AA] transition-colors"
              >
                {isEditing ? "SAVE" : "EDIT"}
              </button>
            )}
            {/* ✅ Delete Button */}
            <button
              onClick={onDelete}
              className="px-3 h-8 flex items-center justify-center rounded-full text-xs font-bold border border-red-500/40 text-red-400 hover:border-red-500 hover:text-red-500 transition-colors"
            >
              DELETE
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-[#FFF1AA]/40 text-[#FFF1AA]/80 hover:border-[#FFF1AA] hover:text-[#FFF1AA] transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
          {/* Title + crescents + date */}
          <div className="flex flex-col items-center gap-3">
            {isEditing ? (
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-center bg-black/20 border-b border-(--gold-cream)/50 text-(--gold-primary) text-2xl font-bold font-lexend focus:outline-none focus:border-(--gold-bright) px-2 py-1"
              />
            ) : (
              <h1 className="font-bold text-(--gold-primary) text-3xl font-lexend text-center">{title}</h1>
            )}

            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <img
                  key={i}
                  src={Crescent}
                  alt={i < (isEditing ? editCrescents : activeCrescents) ? "active" : "inactive"}
                  onClick={() => isEditing && setEditCrescents(i + 1)}
                  className={`w-7 h-7 ${
                    i < (isEditing ? editCrescents : activeCrescents) ? "crescent-active" : "crescent-inactive"
                  } ${isEditing ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
                />
              ))}
            </div>
            <p className="font-semibold text-(--gold-cream) text-sm">Date: {date}</p>
          </div>

          <div className="border-t border-(--gold-cream)/15" />

          {/* Description */}
          <div>
            <p className="font-bold text-(--gold-primary) text-sm mb-1">Description</p>
            {isEditing ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className="w-full bg-black/20 border border-(--gold-cream)/50 rounded-lg p-3 text-amber-100/80 text-sm focus:outline-none focus:border-(--gold-bright) resize-none"
              />
            ) : (
              <p className="text-amber-100/80 text-sm leading-relaxed">{description}</p>
            )}
          </div>

          {/* Volunteers Needed */}
          <div>
            <p className="font-bold text-(--gold-primary) text-sm mb-1">Volunteers Needed:</p>
            {isEditing ? (
              <input
                type="number"
                value={editVolunteers}
                onChange={(e) => setEditVolunteers(e.target.value)}
                placeholder="Number of volunteers"
                className="w-full bg-black/20 border border-(--gold-cream)/50 rounded-lg p-2 text-amber-100/80 text-sm focus:outline-none focus:border-(--gold-bright)"
              />
            ) : volunteersNeeded ? (
              <p className="text-sm text-amber-100/80 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0 fill-[#D4AF37]" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <span>{volunteersNeeded} volunteers required</span>
              </p>
            ) : (
              <p className="text-sm text-amber-100/50 italic">None specified</p>
            )}
          </div>

          {/* Summary bullet list (Hidden while editing for cleaner UI) */}
          {!isEditing && summary.length > 0 && (
            <div>
              <p className="font-bold text-(--gold-primary) text-sm mb-2">Summary:</p>
              <ul className="space-y-1 pl-1">
                {summary.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-amber-100/80">
                    <span className="text-amber-200/60 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Completed banner */}
          {completed && (
            <div className="w-full flex flex-col items-center gap-2 mt-2">
              <div className="flex items-center w-full justify-center gap-4">
                <span className="h-1 rounded bg-(--gold-cream) w-20" />
                <span className="text-(--gold-bright) text-2xl font-bold tracking-wide">Completed</span>
                <span className="h-1 rounded bg-(--gold-cream) w-20" />
              </div>
              <p className="text-amber-200/60 text-sm">{completedOn ?? date}</p>
            </div>
          )}

          {/* CTA Button */}
          {!isEditing && (
            completed ? (
              <button
                onClick={() => onToggleCompleted?.()}
                className="mt-1 w-full py-3 rounded-full border-2 border-[#D4AF37]/60 text-[#D4AF37]/80 text-sm font-bold tracking-widest hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center justify-center gap-2"
              >
                <span>✓</span>
                <span>COMPLETED{completedOn ? ` · ${completedOn}` : ""}</span>
              </button>
            ) : (
              <button
                onClick={() => onToggleCompleted?.()}
                className="mt-1 w-full py-3 rounded-full bg-linear-to-r from-[#C9A227] to-[#E8C84A] text-[#0A1128] font-bold text-sm tracking-widest hover:brightness-110 transition-all shadow-[0_0_18px_2px_rgba(212,175,55,0.3)]"
              >
                MARK AS COMPLETED
              </button>
            )
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskModal;