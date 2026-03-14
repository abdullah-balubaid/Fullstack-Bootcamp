import { useState, useEffect } from "react";
import backGroundPattern      from "./assets/Background Vector.svg";
import lanternRight           from "./assets/Right lanterns.png";
import lanternLeft            from "./assets/left lanterns.png";
import Header                 from "./components/Header";
import Input                  from "./components/Input";
import TaskCard               from "./components/TaskCard";
import TaskModal              from "./components/TaskModal";
import ParticleBackground     from "./components/ParticleBackground";
import type { TaskCardProps } from "./components/TaskCard";
import taskData               from "./data.json";

// Define the Task type clearly
type Task = TaskCardProps & { id: number };
const INITIAL_TASKS = taskData as Task[];

function App() {
  // 1. Persistence: Load from localStorage or fallback to JSON data
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("ramadan-tasks");
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [openTaskId, setOpenTaskId] = useState<number | null>(null);

  // 2. Sync to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("ramadan-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;

  // 3. Logic to add a new task (to be passed to <Input />)
  const handleAddTask = (title: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      date: new Date().toLocaleDateString('en-GB'), // e.g., "14/03/2026"
      completed: false,
      totalCrescents: 5,
      activeCrescents: 0,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleCompleted = (id: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? t.completed
            ? { ...t, completed: false, completedOn: undefined, activeCrescents: 0 }
            : { ...t, completed: true, completedOn: new Date().toLocaleDateString(), activeCrescents: t.totalCrescents }
          : t
      )
    );
  };

  return (
    <div
      className="min-h-screen bg-(--bg-dark) text-white relative overflow-hidden font-sans flex flex-col items-center"
      style={{ backgroundImage: `url(${backGroundPattern})`, backgroundSize: "cover" }}
    >
      <ParticleBackground />

      {/* Decorative Lanterns */}
      <img src={lanternRight} alt="" className="absolute top-0 right-0 w-32 md:w-70 opacity-80 z-2 pointer-events-none" />
      <img src={lanternLeft}  alt="" className="absolute top-0 left-0 w-32 md:w-70 opacity-80 z-2 pointer-events-none" />

      {/* Main Content Frame */}
      <div className="relative z-2 mx-auto w-[95vw] min-h-[90vh] border-[3px] border-(--text-cream)
                      flex flex-col items-center gap-10 py-12 px-6 md:px-10 shadow-2xl my-12">
        
        <div className="max-w-6xl w-full flex flex-col items-center gap-8">
          <Header />
          
          {/* Pass the add function to your Input component */}
          <Input onAddTask={handleAddTask} />

          {/* Task Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                onClick={() => setOpenTaskId(task.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Portal Modal */}
      {openTask && (
        <TaskModal
          open={openTaskId !== null}
          onClose={() => setOpenTaskId(null)}
          onToggleCompleted={() => handleToggleCompleted(openTask.id)}
          {...openTask}
        />
      )}
    </div>
  );
}

export default App;