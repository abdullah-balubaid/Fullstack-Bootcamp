import star_priority from "../assets/star_priority.svg";
import joyStick from "../assets/joyStick.png"; // Assuming it's a PNG, change to .svg if needed!

// Step 5A — Define the shape of a task's props:
export type TaskCardProps = {
  id: number;
  title: string;
  description: string;
  date: string;
  activeCrescents?: number;   // Keeps the same data name, but renders stars
  variant?: "small" | "wide";
  completed?: boolean;
  completedOn?: string;       
  summary?: string[];
  volunteersNeeded?: number;
  tag?: string;               // CHALLENGE 2: Added the tag prop
  onClick?: () => void;
};

// Step 5B — Build the card UI:
const TaskCard = ({
  title,
  description,
  date,
  activeCrescents = 0,
  variant         = "small",
  completed       = false,
  completedOn,
  tag,                        // Destructure the tag
  onClick,
}: TaskCardProps) => {
  const isWide = variant === "wide";

  return (
    <div
      onClick={onClick}
      className={[
        "relative bg-(--bg-dark) bg-opacity-40 backdrop-blur-md",
        "border rounded-2xl flex flex-col items-center",
        "px-6 pt-4 pb-5 overflow-hidden",
        // Changed the shadow to a neon green glow when completed
        completed
          ? "border-(--gold-bright) shadow-[0_0_15px_rgba(0,242,255,0.3)]" 
          : "border-(--gold-cream)",
        isWide ? "md:col-span-2" : "",
        onClick ? "cursor-pointer hover:border-(--gold-primary) transition-colors duration-200" : "", 
      ].filter(Boolean).join(" ")}
    >
      {completed && (
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-2xl pointer-events-none"/>
      )}

      {/* CHALLENGE 2: Render the Tag Badge */}
      {tag && (
        <span className="text-[10px] font-black px-2 py-1 mb-2 rounded bg-(--gold-cream)/20 text-(--gold-cream) border border-(--gold-cream) w-fit uppercase tracking-wider shadow-[0_0_5px_rgba(0,242,255,0.4)]">
          {tag}
        </span>
      )}

      {/* Title Framed by Joysticks */}
      <div className="relative w-full flex items-center justify-between gap-2 min-h-12 mt-1">
        <img 
          src={joyStick} 
          alt="Joystick Left" 
          className={`w-6 h-6 shrink-0 ${completed ? "opacity-40 grayscale" : "opacity-90"}`} 
        />
        <h3 className={`font-bold text-center text-base leading-tight uppercase tracking-wide
          ${completed ? "text-(--text-cream)/50" : "text-(--text-cream)" }`}>
          {title}
        </h3>
        <img 
          src={joyStick} 
          alt="Joystick Right" 
          className={`w-6 h-6 shrink-0 ${completed ? "opacity-40 grayscale" : "opacity-90"}`} 
        />
      </div>
      
      {/* Description - Removed amber, using neutral gray/white for arcade contrast */}
      <p className={`relative flex-1 flex items-center text-center leading-snug text-sm mt-2 px-1
        ${completed ? "text-gray-500" : "text-gray-300"}
      `}>
        {description}
      </p>

      {/* Priority Stars (Replacing the Crescents) */}
      <div className="relative flex items-center gap-1 mt-4 mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <img 
            key={i}
            src={star_priority}
            alt={i < activeCrescents ? "active-star" : "inactive-star"}
            // Arcade styling: lit stars glow, inactive stars are dim
            className={`w-5 h-5 transition-all ${
              i < activeCrescents 
                ? "opacity-100 drop-shadow-[0_0_5px_var(--gold-primary)]" 
                : "opacity-20 grayscale"
            }`}
          />
        ))}
      </div>
  
      {/* Footer / Date area */}
      {completed ? (
        <div className="relative w-full mt-3">
          <div className="flex items-center gap-2 w-full">
            <span className="flex-1 border-t border-(--gold-bright)/50" />
            <span className="text-(--gold-bright) text-xs font-black tracking-widest uppercase">
              Mission Clear
            </span>
            <span className="flex-1 border-t border-(--gold-bright)/50" />
          </div>
          <p className="text-center text-gray-500 text-[10px] mt-1 uppercase tracking-wider">
            {completedOn ?? date}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 font-bold tracking-widest text-[10px] mt-3 uppercase">{date}</p>
      )}
    </div>
  );
};

export default TaskCard;