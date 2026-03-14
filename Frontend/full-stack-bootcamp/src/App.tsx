import { useState, useEffect } from "react";
import backGroundPattern from "./assets/Background-Vector.svg";
import contrllerRight from "./assets/right controller.png";
import controllerLeft from "./assets/left controller.png";
import Header from "./components/Header";
import Input from "./components/Input";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import ParticleBackground from "./components/ParticleBackground";
import { getAllTasks, completeTask, updateTask, deleteTask } from "./api";
import type { Task } from "./api";


function App() {
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isEditMode, setIsEditMode] = useState(false); // Add this line!
  const handleTaskAdded = (newTask: Task) => {setTasks((prev) => [newTask, ...prev]);
  };

  // ── Task 1: Load tasks from the API when the page first opens ──
  // useEffect with [] runs exactly once — after the first render.
  useEffect(() => {
    getAllTasks().then(setTasks);
  }, []);

  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;

  // Toggle a task between completed / not completed.
  const handleToggleCompleted = async (id: number) => {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  const updated = task.completed
    ? await updateTask(id, { completed: false, completedOn: undefined })
    : await completeTask(id);
  setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
};

  // Save edits made inside TaskModal.
  const handleUpdate = async (id: number, changes: Partial<Task>) => {
    const updated = await updateTask(id, changes);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  // Delete a task from TaskModal.
  const handleDelete = async (id: number) => {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setOpenTaskId(null);
  };
  
  return (
  <div className="min-h-screen bg-(--bg-dark) text-white relative overflow-hidden font-sans flex flex-col items-center">
    
    {/* LAYER 1: The Vector Pattern (Deepest) */}
    <img 
      src={backGroundPattern} 
      className="absolute top-0 left-0 w-full h-full object-cover opacity-5 z-0" 
      alt="background"
    />

    {/* LAYER 2: The Particles (On top of vector, behind content) */}
    <div className="absolute inset-0 z-1">
      <ParticleBackground />
    </div>

    {/* LAYER 3: The Decorations (Lanterns/Arcade assets) */}
    <img src={contrllerRight} alt="Right Asset" className="absolute top-0 right-0 w-32 md:w-70 opacity-60 z-2" />
    <img src={controllerLeft} alt="Left Asset" className="absolute top-0 left-0 w-32 md:w-70 opacity-60 z-2" />

    {/* LAYER 4: The Main Content Frame (On Top) */}
    <div className="relative z-10 mx-auto w-[95vw] min-h-[90vh] border-[3px] border-(--gold-cream) flex flex-col items-center gap-10 py-12 px-10 shadow-[0_0_30px_rgba(0,242,255,0.2)] my-12 bg-transparent">
      <div className="max-w-4xl w-full flex flex-col items-center justify-start gap-6">
        <Header />
        {/* Pass the state to your Input component */}
        <Input 
          onTaskAdded={handleTaskAdded} 
          isEditMode={isEditMode} 
          onToggleEdit={() => setIsEditMode(!isEditMode)} 
        />

        

        {/* Task card grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tasks.length === 0 ? (
          <p className="col-span-full text-center opacity-50">No missions found. Deploy Gemini to create one.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onClick={() => setOpenTaskId(task.id)}/>
          ))
        )}
        </div>
      </div>
    </div>

    {/* Modal */}

      {openTask && (
        <TaskModal
          open={openTaskId !== null}
          onClose={() => setOpenTaskId(null)}
          onToggleCompleted={() => handleToggleCompleted(openTask!.id)}
          onUpdate={(changes: Partial<Task>) => handleUpdate(openTask!.id, changes)}
          onDelete={() => handleDelete(openTask!.id)}
          startInEditMode={isEditMode} // Add this line!
          {...openTask}
        />
      )}
  </div>
);
  
}
  
export default App;