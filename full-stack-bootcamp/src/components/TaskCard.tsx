import Crescent from "../assets/Crescent.svg";
import Lantern from "../assets/Lantern.png";

// TODO (Step 5): Build the TaskCard component

// Step 5A — Define the shape of a task's props:
export type TaskCardProps = {
  id: number;
  title: string;
  description: string;
  date: string;
  activeCrescents?: number;   // how many crescents to show as active (0–5)
  variant?: "small" | "wide";
  completed?: boolean;
  completedOn?: string;       // e.g. "Mar 12th 2026"
  summary?: string[];
  volunteersNeeded?: number;
  onClick?: () => void;       // called when the card is clicked
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
  onClick,
}: TaskCardProps) => {
  const isWide = variant == "wide";
  return (
    <div
    onClick={onClick}
    className={[
      "relative bg-(--bg-dark) bg-opacity-20 backdrop-blur-[3px]",
      "border rounded-2xl flex flex-col items-center",
      "px-6 pt-4 pb-5 overflow-hidden",
      completed
      ? "border-(--gold-cream) shadow-[0_0_20px_3px_rgba(212,175,55,0.18)]"
      : "border-(--gold-cream)",
      isWide ? "md:col-span-2" : "",
      onClick ? "cursor-pointer hover:border-(--gold-cream) transition-colors\
      duration-200" : "", 
    ].filter(Boolean).join(" ")}>

    {completed && (
      <div className="absolute inset-0 bg-(--bg-dark) bg-opacity-25 
      rounded-2xl pointer-events-none"/> )}

    <div className="relative w-full flex items-center justify-between gap-2
    min-h-12">
    <img src={Lantern} alt="" className={`w-5 h-8 shrink-0 ${completed ?
      "opacity-50" : "opacity-85"}`} />
    <h3 className={`font-medium text-center text-base leading-tight 
    ${completed ? "text-(--text-cream)/70" : "text-(--text-cream)" }`}>
        {title}
      </h3>
    <img src={Lantern} alt="" className={`w-5 h-8 shrink-0 ${completed ?
    "opacity-50" : "opacity-85"}`} />
    </div>
    
    <p className={`relative flex-1 flex items-center text-center
      leading-snug text-sm mt-2 px-1
      ${completed ? "text-amber-100/45" : "text-amber-100/80"}
      `}>
        {description}
      </p>

    <div className="relative flex items-center gap-1 mt-3">
      {Array.from({ length: 5 }).map((_,i) => (
      <img 
      key={i}
      src={Crescent}
      alt={i < activeCrescents ? "active" : "inactive"}
      className={"w-6 h-6 " + (i < activeCrescents ? "crescent-active"
        : "crescent-inactive")}
      />
      ))}
    </div>
  
  {completed ? (
        <div className="relative w-full mt-3">
          <div className="flex items-center gap-2 w-full">
            <span className="flex-1 border-t-2 border-(--gold-bright)/70" />
            <span className="text-(--gold-bright) text-base font-bold tracking-wide whitespace-nowrap">
              Completed
            </span>
            <span className="flex-1 border-t-2 border-(--gold-bright)/70" />
          </div>
          <p className="text-center text-amber-200/50 text-xs mt-1">
            {completedOn ?? date}
          </p>
        </div>
      ) : (
        <p className="text-amber-200/50 text-xs mt-3">{date}</p>
      )}
    </div>
  );
};

export default TaskCard;






