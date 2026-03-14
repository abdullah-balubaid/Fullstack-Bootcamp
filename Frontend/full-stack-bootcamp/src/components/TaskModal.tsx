import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import star_priority from "../assets/star_priority.svg"; 
import type { TaskCardProps } from "./TaskCard";
import type { Task } from "../api";

type TaskModalProps = TaskCardProps & {
  open: boolean;
  onClose: () => void;
  onToggleCompleted?: () => void;
  onUpdate?: (changes: Partial<Task>) => void; 
  onDelete?: () => void;                       
  totalCrescents?: number;
  startInEditMode?: boolean;
};

const TaskModal = ({
  open, 
  onClose, 
  onToggleCompleted,
  onUpdate,
  onDelete,
  title, 
  description, 
  date,
  activeCrescents = 0, 
  summary = [], 
  volunteersNeeded,
  tag, 
  completed = false, 
  completedOn,
  startInEditMode = false,
}: TaskModalProps) => {
  // ✅ 1. ADDED STATE FOR ALL EDITABLE FIELDS
  const [isEditing, setIsEditing] = useState(startInEditMode);
  const [editTitle, setEditTitle] = useState(title);
  const [editDesc, setEditDesc] = useState(description);
  const [editDate, setEditDate] = useState(date);
  const [editVolunteers, setEditVolunteers] = useState(volunteersNeeded || 0);
  const [editPriority, setEditPriority] = useState(activeCrescents);

  // Sync state if props change while modal is open
  useEffect(() => {
    setEditTitle(title);
    setEditDesc(description);
    setEditDate(date);
    setEditVolunteers(volunteersNeeded || 0);
    setEditPriority(activeCrescents);
  }, [title, description, date, volunteersNeeded, activeCrescents]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    if (onUpdate) {
      // ✅ 2. SEND ALL FIELDS TO THE BACKEND
      onUpdate({ 
        title: editTitle, 
        description: editDesc,
        date: editDate,
        volunteersNeeded: Number(editVolunteers),
        activeCrescents: Number(editPriority) // api.ts will map this to 'priority' for Python
      });
    }
    setIsEditing(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`
          relative w-full max-w-md bg-(--bg-dark) rounded-2xl overflow-hidden
          ${completed
            ? "border-2 border-(--gold-bright) shadow-[0_0_40px_rgba(57,255,20,0.3)]"
            : "border-2 border-(--gold-cream) shadow-[0_0_40px_rgba(0,242,255,0.2)]"
          }
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header bar ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--gold-cream)/30 bg-black/40">
          <h2 className="flex-1 text-center font-bold text-(--gold-cream) text-sm tracking-[0.15em] uppercase">
            Mission Details
          </h2>
          <button
            onClick={onClose}
            className="ml-4 w-8 h-8 flex items-center justify-center rounded-full border border-(--gold-cream)/40 text-(--gold-cream) hover:border-(--gold-primary) hover:text-(--gold-primary) transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 pt-5 pb-6 flex flex-col gap-4">
          
          {/* ✅ 3. THE UPGRADED EDIT MODE UI */}
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <label className="text-(--gold-cream) text-xs uppercase font-bold tracking-widest">Mission Title</label>
              <input 
                value={editTitle} 
                onChange={e => setEditTitle(e.target.value)}
                className="bg-black/50 border border-(--gold-cream) text-white px-3 py-2 rounded focus:outline-none focus:border-(--gold-primary)"
              />

              <label className="text-(--gold-cream) text-xs uppercase font-bold tracking-widest mt-2">Objectives (Description)</label>
              <textarea 
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                rows={4}
                className="bg-black/50 border border-(--gold-cream) text-white px-3 py-2 rounded focus:outline-none focus:border-(--gold-primary) resize-none"
              />

              <div className="flex gap-4 mt-2">
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-(--gold-cream) text-xs uppercase font-bold tracking-widest">Date</label>
                  <input 
                    value={editDate} 
                    onChange={e => setEditDate(e.target.value)}
                    className="bg-black/50 border border-(--gold-cream) text-white px-3 py-2 rounded focus:outline-none focus:border-(--gold-primary)"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-1">
                  <label className="text-(--gold-cream) text-xs uppercase font-bold tracking-widest">Priority Level (1-5)</label>
                  <input 
                    type="number"
                    min="1" max="5"
                    value={editPriority} 
                    onChange={e => setEditPriority(Number(e.target.value))}
                    className="bg-black/50 border border-(--gold-cream) text-white px-3 py-2 rounded focus:outline-none focus:border-(--gold-primary)"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1 mt-2">
                <label className="text-(--gold-cream) text-xs uppercase font-bold tracking-widest">Co-op Players Needed</label>
                <input 
                  type="number"
                  min="0"
                  value={editVolunteers} 
                  onChange={e => setEditVolunteers(Number(e.target.value))}
                  className="bg-black/50 border border-(--gold-cream) text-white px-3 py-2 rounded focus:outline-none focus:border-(--gold-primary)"
                />
              </div>

              <div className="flex gap-2 justify-end mt-4 border-t border-gray-700 pt-4">
                <button onClick={() => setIsEditing(false)} className="text-gray-400 text-sm hover:text-white uppercase font-bold tracking-widest mr-4">Cancel</button>
                <button onClick={handleSave} className="bg-(--gold-cream) text-black px-6 py-2 rounded font-black hover:bg-(--gold-primary) uppercase tracking-widest shadow-[0_0_10px_var(--gold-cream)]">Save</button>
              </div>
            </div>
          ) : (
            <>
              {/* --- VIEW MODE (Unchanged) --- */}
              <div className="flex flex-col items-center gap-3">
                {tag && (
                  <span className="text-[10px] font-black px-3 py-1 rounded bg-(--gold-cream)/20 text-(--gold-cream) border border-(--gold-cream) uppercase tracking-wider shadow-[0_0_5px_rgba(0,242,255,0.4)]">
                    {tag}
                  </span>
                )}
                
                <h1 className="font-bold text-white text-3xl uppercase text-center">{title}</h1>
                <div className="flex items-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <img key={i} src={star_priority}
                      alt={i < activeCrescents ? "active" : "inactive"}
                      className={`w-6 h-6 ${i < activeCrescents ? "drop-shadow-[0_0_5px_var(--gold-primary)]" : "opacity-20 grayscale"}`}
                    />
                  ))}
                </div>
                <p className="font-bold text-gray-500 text-xs tracking-widest uppercase">{date}</p>
              </div>

              <div className="border-t border-gray-700/50" />

              <div>
                <p className="font-bold text-(--gold-cream) text-xs tracking-wider uppercase mb-1">Objectives:</p>
                <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
              </div>

              {volunteersNeeded ? (
                <div>
                  <p className="font-bold text-(--gold-cream) text-xs tracking-wider uppercase mb-1">Co-op Squad Required:</p>
                  <p className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="text-(--gold-primary) text-lg">🕹️</span>
                    <span className="font-bold">{volunteersNeeded} Player{volunteersNeeded > 1 ? 's' : ''} Needed</span>
                  </p>
                </div>
              ) : null}

              {summary.length > 0 && (
                <div>
                  <p className="font-bold text-(--gold-cream) text-xs tracking-wider uppercase mb-2">Summary:</p>
                  <ul className="space-y-1 pl-1">
                    {summary.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-400">
                        <span className="text-(--gold-cream) mt-0.5">▶</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4 justify-center mt-2">
                 <button onClick={onDelete} className="text-sm text-gray-400 hover:text-red-500 uppercase tracking-widest font-bold">Delete</button>
              </div>

              {completed ? (
                <button
                  onClick={onToggleCompleted}
                  className="mt-2 w-full py-3 rounded border-2 border-(--gold-bright) text-(--gold-bright) text-sm font-black tracking-widest hover:bg-(--gold-bright)/10 transition-all uppercase"
                >
                  [ MISSION CLEAR ]
                </button>
              ) : (
                <button
                  onClick={onToggleCompleted}
                  className="mt-2 w-full py-3 rounded bg-(--gold-cream) text-black font-black text-sm tracking-widest hover:bg-(--gold-primary) transition-all shadow-[0_0_15px_rgba(0,242,255,0.4)] uppercase"
                >
                  MARK AS COMPLETED
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TaskModal;