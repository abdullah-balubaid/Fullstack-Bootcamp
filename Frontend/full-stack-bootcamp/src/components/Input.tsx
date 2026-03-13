import { useState } from "react";
import StarIcon from "../assets/Star Icon.png";
import AddIcon from "../assets/Edit Icon.png";
import { createTask } from "../api";
import type { Task } from "../api";

type InputProps = {
  onTaskAdded: (task: Task) => void;
};

const Input = ({ onTaskAdded }: InputProps) => {
  const [value, setValue] = useState("");
  // ✅ ADDED: State to track when Gemini is thinking
  const [isGenerating, setIsGenerating] = useState(false); 

  const handleSubmit = async () => {
    const trimmed = value.trim();
    // ✅ ADDED: Prevent submitting if empty OR if already generating
    if (!trimmed || isGenerating) return; 

    setIsGenerating(true); // Turn ON loading state

    try {
      const newTask = await createTask(trimmed);
      onTaskAdded(newTask);
      setValue(""); 
    } catch (err) {
      console.error("Failed to create task:", err);
    } finally {
      setIsGenerating(false); // Turn OFF loading state when done
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-4xl">
        <input
          aria-label="Add task"
          // ✅ ADDED: Change placeholder while loading
          placeholder={isGenerating ? "Gemini is generating your task..." : "Add your Next Ramadan Task Here......"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          // ✅ ADDED: Disable input and lower opacity while loading
          disabled={isGenerating}
          className={`w-full bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px] border border-(--gold-cream) rounded-full py-4 px-6 pl-12 text-amber-100 outline-none focus:border-(--gold-cream) focus:ring-2 focus:ring-(--gold-primary) transition-opacity ${isGenerating ? "opacity-50 cursor-not-allowed" : "placeholder:text-amber-200/50"}`}
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
          <img src={StarIcon} alt="" className={`w-8 h-8 ${isGenerating ? "animate-spin opacity-50" : ""}`} />
        </span>
      </div>

      <button
        onClick={handleSubmit}
        aria-label="Submit task"
        // ✅ ADDED: Disable button while loading
        disabled={isGenerating}
        className={`ml-4 px-4 py-4 rounded-full bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px] border border-(--gold-cream) text-amber-100 transition-all ${isGenerating ? "opacity-50 cursor-not-allowed" : "hover:border-(--gold-cream)"}`}
      >
        <img src={AddIcon} alt="Add Icon" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Input;