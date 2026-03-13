import { useState } from "react";
import StarIcon from "../assets/Star Icon.png";
import AddIcon from "../assets/Edit Icon.png";
import { createTask } from "../api";
import type { Task } from "../api";

type InputProps = {
  onTaskAdded: (task: Task) => void;
  isEditMode: boolean;       // ✅ ADDED: Knows if edit mode is ON or OFF
  onToggleEdit: () => void;  // ✅ ADDED: Function to flip the switch
};

const Input = ({ onTaskAdded, isEditMode, onToggleEdit }: InputProps) => {
  const [value, setValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false); 

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed || isGenerating) return; 

    setIsGenerating(true); 

    try {
      const newTask = await createTask(trimmed);
      onTaskAdded(newTask);
      setValue(""); 
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsGenerating(false); 
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-4xl">
        <input
          aria-label="Add task"
          placeholder={isGenerating ? "Gemini is generating your task..." : "Enter your next mission......"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={isGenerating}
          className={`w-full bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px] border border-(--gold-cream) rounded-full py-4 px-6 pr-16 text-white outline-none focus:border-(--gold-cream) focus:ring-2 focus:ring-(--gold-primary) transition-opacity ${isGenerating ? "opacity-50 cursor-not-allowed" : "placeholder:text-(--gold-cream)/60"}`}
        />

        {/* ✅ CHANGED: The Star is now a clickable Submit button */}
        <button 
          onClick={handleSubmit}
          disabled={isGenerating}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer disabled:cursor-not-allowed"
          title="Create Task"
        >
          <img src={StarIcon} alt="Submit" className={`w-8 h-8 ${isGenerating ? "animate-spin opacity-50" : ""}`} />
        </button>
      </div>

      {/* ✅ CHANGED: The Pen is now the Edit Mode Toggle */}
      <button
        onClick={onToggleEdit}
        aria-label="Toggle Edit Mode"
        title="Toggle Global Edit Mode"
        className={`ml-4 px-4 py-4 rounded-full border transition-all duration-300 ${
          isEditMode 
            ? "bg-(--gold-cream) border-(--gold-cream) shadow-[0_0_15px_var(--gold-cream)]" 
            : "bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px] border-(--gold-cream)/50 hover:border-(--gold-cream)"
        }`}
      >
        <img 
          src={AddIcon} 
          alt="Toggle Edit" 
          // If edit mode is ON, we invert the pen icon so it stays visible on the glowing cyan background
          className={`w-5 h-5 transition-all duration-300 ${isEditMode ? "filter invert" : ""}`} 
        />
      </button>
    </div>
  );
};

export default Input;