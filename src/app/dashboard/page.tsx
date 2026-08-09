'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { showToast } from '@/components/Toast';
import api from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Plus,
  Search,
  Filter,
  CheckSquare,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react';

interface Subtask {
  id?: string;
  title: string;
  isCompleted: boolean;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'URGENT';
  dueDate?: string;
  createdAt: string;
  subtasks: Subtask[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<{ username: string; isGuest: boolean } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Modal Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'URGENT'>('MEDIUM');
  const [taskStatus, setTaskStatus] = useState<'TODO' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED'>('TODO');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskSubtasks, setTaskSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Dropdown menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (!token || !savedUser) {
      router.push('/');
      return;
    }

    setUser(JSON.parse(savedUser));
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      showToast('Failed to load tasks from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'info');
    router.push('/');
  };

  const handleOpenCreateModal = (status?: Task['status']) => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('MEDIUM');
    setTaskStatus(status || 'TODO');
    setTaskDueDate('');
    setTaskSubtasks([]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    setTaskPriority(task.priority);
    setTaskStatus(task.status);
    setTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    setTaskSubtasks(task.subtasks || []);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setTaskSubtasks([...taskSubtasks, { title: newSubtaskTitle.trim(), isCompleted: false }]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtaskInForm = (index: number) => {
    const updated = [...taskSubtasks];
    updated[index].isCompleted = !updated[index].isCompleted;
    setTaskSubtasks(updated);
  };

  const handleRemoveSubtaskInForm = (index: number) => {
    setTaskSubtasks(taskSubtasks.filter((_, i) => i !== index));
  };

  const handleSubmitTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      showToast('Task title is required', 'error');
      return;
    }

    const payload = {
      title: taskTitle.trim(),
      description: taskDescription.trim() || undefined,
      priority: taskPriority,
      status: taskStatus,
      dueDate: taskDueDate || undefined,
      subtasks: taskSubtasks,
    };

    try {
      if (editingTask) {
        const res = await api.patch(`/tasks/${editingTask.id}`, payload);
        setTasks(tasks.map(t => t.id === editingTask.id ? res.data : t));
        showToast('Task updated successfully', 'success');
      } else {
        const res = await api.post('/tasks', payload);
        setTasks([res.data, ...tasks]);
        showToast('Task created successfully', 'success');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      showToast('Failed to save task', 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
      showToast('Task deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete task', 'error');
    }
    setActiveMenuId(null);
  };

  const handleMoveTask = async (task: Task, newStatus: Task['status']) => {
    try {
      const res = await api.patch(`/tasks/${task.id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
      showToast(`Moved to ${newStatus.replace('_', ' ')}`, 'success');
    } catch (err) {
      showToast('Failed to move task', 'error');
    }
  };

  const handleToggleSubtaskDb = async (task: Task, subtaskIndex: number) => {
    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[subtaskIndex].isCompleted = !updatedSubtasks[subtaskIndex].isCompleted;

    try {
      const res = await api.patch(`/tasks/${task.id}`, { subtasks: updatedSubtasks });
      setTasks(tasks.map(t => t.id === task.id ? res.data : t));
    } catch (err) {
      showToast('Failed to update subtask status', 'error');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const columns: { title: string; status: Task['status']; color: string; dot: string }[] = [
    { title: 'To Do', status: 'TODO', color: 'bg-zinc-100 dark:bg-zinc-800/40 text-foreground border-zinc-200/60 dark:border-zinc-800', dot: 'bg-zinc-400' },
    { title: 'In Progress', status: 'IN_PROGRESS', color: 'bg-blue-50/50 dark:bg-blue-950/20 text-foreground border-blue-100/50 dark:border-blue-900/40', dot: 'bg-blue-500' },
    { title: 'Under Review', status: 'UNDER_REVIEW', color: 'bg-amber-50/50 dark:bg-amber-950/20 text-foreground border-amber-100/50 dark:border-amber-900/40', dot: 'bg-amber-500' },
    { title: 'Completed', status: 'COMPLETED', color: 'bg-emerald-50/50 dark:bg-emerald-950/20 text-foreground border-emerald-100/50 dark:border-emerald-900/40', dot: 'bg-emerald-500' }
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500">
      
      {/* Top Navbar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border bg-card px-6 py-4 flex items-center justify-between shadow-sm z-10"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 15 }}
            className="p-2 bg-primary/10 rounded-xl cursor-pointer"
          >
            <Sparkles className="w-6 h-6 text-primary animate-pulse" />
          </motion.div>
          <h1 className="text-xl font-bold tracking-tight">ZenTask</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/30">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
              {user?.username.substring(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-bold">
              {user?.username} {user?.isGuest && <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full ml-1 font-extrabold">GUEST</span>}
            </span>
          </div>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as any)}
            className="text-[10px] p-1.5 rounded-lg border border-border bg-card text-foreground focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer shadow-sm font-bold uppercase tracking-wider"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="soft-blue">Soft Blue</option>
            <option value="emerald">Emerald</option>
            <option value="sunset">Sunset</option>
          </select>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg border border-border hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.header>

      {/* Main Content Panel */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex-1 flex flex-col p-6 space-y-6 max-w-7xl mx-auto w-full"
      >
        
        {/* Filters and Add Button Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card border border-border/80 p-4 rounded-2xl shadow-sm">
          
          <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <div className="relative flex-1 max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-xs font-semibold"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs p-2.5 rounded-xl border border-border bg-background text-foreground focus:ring-1 focus:ring-primary focus:outline-none cursor-pointer font-bold"
              >
                <option value="ALL">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenCreateModal()}
            className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-xs"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </motion.button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center py-24">
            <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          /* Kanban Board Columns */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {columns.map((col, colIndex) => {
              const colTasks = filteredTasks.filter(t => t.status === col.status);

              return (
                <motion.div 
                  key={col.status} 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * colIndex, duration: 0.4 }}
                  className="bg-card/45 backdrop-blur-sm border border-border/80 rounded-2xl flex flex-col p-4.5 shadow-sm min-h-[500px]"
                >
                  
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-border/60">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                      <h2 className="font-extrabold text-sm tracking-tight">{col.title}</h2>
                      <span className="text-[10px] bg-muted text-muted-foreground font-bold px-2 py-0.5 rounded-full border border-border/50">
                        {colTasks.length}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenCreateModal(col.status)}
                      className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg cursor-pointer transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Task list container */}
                  <div className="space-y-4 flex-1 overflow-y-auto min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                      {colTasks.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="py-12 text-center text-xs text-muted-foreground/60 italic"
                        >
                          No tasks in this stage
                        </motion.div>
                      ) : (
                        colTasks.map(task => {
                          const totalSubtasks = task.subtasks?.length || 0;
                          const completedSubtasks = task.subtasks?.filter(s => s.isCompleted).length || 0;
                          const priorityStyle =
                            task.priority === 'URGENT'
                              ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                              : task.priority === 'MEDIUM'
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                              : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';

                          return (
                            <motion.div
                              key={task.id}
                              layoutId={task.id}
                              layout
                              initial={{ opacity: 0, y: 10, scale: 0.98 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                              whileHover={{ y: -3, transition: { duration: 0.15 } }}
                              className="bg-card text-card-foreground border border-border rounded-xl p-4.5 shadow-sm relative group hover:shadow-md hover:border-primary/40 transition-all duration-300"
                            >
                              {/* Task top details */}
                              <div className="flex items-center justify-between mb-3.5">
                                <span className={`text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full border ${priorityStyle}`}>
                                  {task.priority}
                                </span>
                                
                                <div className="relative">
                                  <button
                                    onClick={() => setActiveMenuId(activeMenuId === task.id ? null : task.id)}
                                    className="p-1 hover:bg-muted rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
                                  >
                                    <MoreVertical className="w-3.5 h-3.5" />
                                  </button>

                                  {activeMenuId === task.id && (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      className="absolute right-0 mt-1 w-28 bg-card border border-border rounded-lg shadow-lg py-1 z-30"
                                    >
                                      <button
                                        onClick={() => handleOpenEditModal(task)}
                                        className="w-full text-left px-3 py-1.5 text-xs font-semibold hover:bg-muted flex items-center gap-1.5 cursor-pointer text-foreground"
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Edit Task
                                      </button>
                                      <button
                                        onClick={() => handleDeleteTask(task.id)}
                                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                      </button>
                                    </motion.div>
                                  )}
                                </div>
                              </div>

                              {/* Task Content */}
                              <h3 className="font-extrabold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3.5 font-medium leading-relaxed">
                                  {task.description}
                                </p>
                              )}

                              {/* Subtask completeness indicator */}
                              {totalSubtasks > 0 && (
                                <div className="mb-4 p-2.5 rounded-xl bg-muted/30 border border-border/40">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground mb-1.5">
                                    <span className="flex items-center gap-1">
                                      <CheckSquare className="w-3.5 h-3.5 text-primary/70" />
                                      Checklist
                                    </span>
                                    <span>{completedSubtasks}/{totalSubtasks}</span>
                                  </div>
                                  <div className="w-full bg-border rounded-full h-1">
                                    <div
                                      className="bg-primary h-1 rounded-full transition-all duration-300"
                                      style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                                    />
                                  </div>
                                  <div className="mt-2.5 space-y-1.5 max-h-24 overflow-y-auto pr-1">
                                    {task.subtasks.map((sub, index) => (
                                      <label
                                        key={index}
                                        className="flex items-center gap-2 text-[10px] text-foreground/80 hover:text-foreground cursor-pointer select-none font-semibold"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={sub.isCompleted}
                                          onChange={() => handleToggleSubtaskDb(task, index)}
                                          className="w-3.5 h-3.5 rounded text-primary focus:ring-primary border-border bg-background cursor-pointer"
                                        />
                                        <span className={sub.isCompleted ? 'line-through text-muted-foreground/80 font-medium' : 'font-semibold'}>
                                          {sub.title}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Bottom widgets bar */}
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                                {/* Due Date */}
                                {task.dueDate ? (
                                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                                    <Calendar className="w-3 h-3 text-primary/80" />
                                    <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                ) : (
                                  <div />
                                )}

                                {/* Navigation Arrows */}
                                <div className="flex items-center justify-end gap-1">
                                  {col.status !== 'TODO' && (
                                    <button
                                      onClick={() => {
                                        const prev = col.status === 'IN_PROGRESS' ? 'TODO' : col.status === 'UNDER_REVIEW' ? 'IN_PROGRESS' : 'UNDER_REVIEW';
                                        handleMoveTask(task, prev);
                                      }}
                                      className="p-1 hover:bg-muted border border-border/60 rounded-lg cursor-pointer"
                                    >
                                      <ChevronLeft className="w-3 h-3" />
                                    </button>
                                  )}
                                  {col.status !== 'COMPLETED' && (
                                    <button
                                      onClick={() => {
                                        const next = col.status === 'TODO' ? 'IN_PROGRESS' : col.status === 'IN_PROGRESS' ? 'UNDER_REVIEW' : 'COMPLETED';
                                        handleMoveTask(task, next);
                                      }}
                                      className="p-1 hover:bg-muted border border-border/60 rounded-lg cursor-pointer"
                                    >
                                      <ChevronRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.main>

      {/* Task Creation / Editing Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[2px]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-card text-card-foreground border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-muted/10">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitTask} className="p-6 space-y-4.5 max-h-[75vh] overflow-y-auto">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Title</label>
                  <input
                    type="text"
                    placeholder="Provide a short task title"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs font-semibold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Description</label>
                  <textarea
                    placeholder="Provide a detailed description of the work (optional)"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs font-semibold resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs font-bold cursor-pointer"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Status</label>
                    <select
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs font-bold cursor-pointer"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary/80" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs font-semibold cursor-pointer"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">Subtasks Checklist</label>
                  
                  <div className="space-y-2">
                    {taskSubtasks.map((st, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/40 text-xs font-semibold">
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={st.isCompleted}
                            onChange={() => handleToggleSubtaskInForm(index)}
                            className="w-3.5 h-3.5 rounded text-primary focus:ring-primary border-border bg-background cursor-pointer"
                          />
                          <span className={st.isCompleted ? 'line-through text-muted-foreground/80 font-medium' : 'text-foreground font-semibold'}>
                            {st.title}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtaskInForm(index)}
                          className="p-1 hover:bg-muted text-rose-500 rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add subtask..."
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubtask();
                        }
                      }}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-xs font-semibold"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 active:scale-[0.98] transition-all text-xs cursor-pointer shadow-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2 px-4 rounded-xl border border-border hover:bg-muted text-foreground transition-all cursor-pointer text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer shadow-sm text-xs"
                  >
                    Save Changes
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
