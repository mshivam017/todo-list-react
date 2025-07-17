import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Calendar, Clock, Star, Home, Settings, User, List, Menu, Bell, X } from 'lucide-react';

export default function MobileTodoApp() {
  // Initialize state from localStorage or use default values
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, text: 'Design new homepage', completed: false, priority: 'high', dueDate: '2025-05-03', favorite: true },
      { id: 2, text: 'Review project proposal', completed: true, priority: 'medium', dueDate: '2025-04-28', favorite: false },
      { id: 3, text: 'Prepare presentation', completed: false, priority: 'high', dueDate: '2025-05-10', favorite: true },
      { id: 4, text: 'Send weekly report', completed: false, priority: 'low', dueDate: '2025-04-29', favorite: false }
    ];
  });
  
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newDueDate, setNewDueDate] = useState('');
  const [filter, setFilter] = useState(() => {
    return localStorage.getItem('filter') || 'all';
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'today';
  });
  const [showNotification, setShowNotification] = useState(false);
  
  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  // Save filter preference
  useEffect(() => {
    localStorage.setItem('filter', filter);
  }, [filter]);
  
  // Save active tab
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);
  
  const addTask = () => {
    if (newTask.trim() !== '') {
      const task = {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority: newPriority,
        dueDate: newDueDate,
        favorite: false
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setNewPriority('medium');
      setNewDueDate('');
      setShowAddTask(false);
      
      // Show notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };
  
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const toggleFavorite = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, favorite: !task.favorite } : task
    ));
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  // Export tasks data as JSON file
  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'tasks-backup.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Import tasks from JSON file
  const importTasks = (event) => {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], "UTF-8");
    fileReader.onload = e => {
      try {
        const tasks = JSON.parse(e.target.result);
        setTasks(tasks);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } catch (error) {
        console.error("Error importing tasks:", error);
        alert("Invalid JSON file");
      }
    };
  };
  
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'favorites') return task.favorite;
    return true;
  });
  
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-400 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };
  
  // Get current date
  const getCurrentDate = () => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="max-w-sm mx-auto bg-gray-100 h-screen flex flex-col relative overflow-hidden">
      
      {/* App Header */}
      <div className="bg-white px-4 py-4 shadow-sm z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Menu size={20} className="text-gray-700" />
            <h1 className="text-xl font-bold ml-3 text-gray-800">My Tasks</h1>
          </div>
          <div className="flex space-x-4">
            <Bell 
              size={20} 
              className="text-gray-700" 
            />
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
              JD
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Tabs */}
      <div className="bg-white px-4 py-3">
        <div className="flex space-x-4">
          <button 
            className={`pb-2 font-medium ${activeTab === 'today' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('today')}
          >
            Today
          </button>
          <button 
            className={`pb-2 font-medium ${activeTab === 'upcoming' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button 
            className={`pb-2 font-medium ${activeTab === 'important' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('important')}
          >
            Important
          </button>
        </div>
      </div>
      
      {/* Date Display */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-bold text-gray-800">Today</h2>
        <p className="text-gray-500 text-sm">{getCurrentDate()}</p>
      </div>
      
      {/* Filter Pills */}
      <div className="px-4 flex space-x-2 overflow-x-auto pb-2">
        <button 
          className={`px-4 py-2 rounded-full text-sm flex-shrink-0 ${filter === 'all' ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-white text-gray-600'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm flex-shrink-0 ${filter === 'active' ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-white text-gray-600'}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm flex-shrink-0 ${filter === 'completed' ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-white text-gray-600'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={`px-4 py-2 rounded-full text-sm flex-shrink-0 ${filter === 'favorites' ? 'bg-purple-100 text-purple-700 font-medium' : 'bg-white text-gray-600'}`}
          onClick={() => setFilter('favorites')}
        >
          Favorites
        </button>
      </div>
      
      {/* Import/Export buttons */}
      <div className="px-4 flex space-x-2 py-2">
        <button 
          onClick={exportTasks}
          className="bg-blue-600 text-white text-xs px-3 py-1 rounded-lg flex-shrink-0"
        >
          Export Tasks
        </button>
        <label className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg flex-shrink-0 cursor-pointer">
          Import Tasks
          <input 
            type="file" 
            accept=".json" 
            className="hidden" 
            onChange={importTasks}
          />
        </label>
      </div>
      
      {/* Task list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <List size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-700 font-medium">No tasks found</p>
            <p className="text-gray-500 text-sm mt-1">Your task list is empty</p>
            <button 
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm"
              onClick={() => setShowAddTask(true)}
            >
              Add a new task
            </button>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start">
                <button 
                  className={`mt-1 w-6 h-6 rounded-full mr-3 flex-shrink-0 flex items-center justify-center border-2 ${task.completed ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}
                  onClick={() => toggleComplete(task.id)}
                >
                  {task.completed && <Check size={14} className="text-white" />}
                </button>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {task.text}
                    </p>
                    <button 
                      className={`${task.favorite ? 'text-yellow-500' : 'text-gray-400'}`}
                      onClick={() => toggleFavorite(task.id)}
                    >
                      <Star size={18} className={task.favorite ? 'fill-yellow-500' : ''} />
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-3 text-xs">
                    <span className={`px-3 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <div className="ml-2 flex items-center text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {task.dueDate}
                      </div>
                    )}
                    
                    <button 
                      className="ml-auto text-gray-400 hover:text-red-500"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Bottom Navigation Bar */}
      <div className="bg-white px-6 py-3 flex justify-between items-center shadow-lg z-10">
        <button className="flex flex-col items-center text-purple-600">
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <List size={20} />
          <span className="text-xs mt-1">Tasks</span>
        </button>
        <div className="relative -mt-8">
          <button 
            className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center shadow-lg text-white"
            onClick={() => setShowAddTask(true)}
          >
            <Plus size={24} />
          </button>
        </div>
        <button className="flex flex-col items-center text-gray-500">
          <Calendar size={20} />
          <span className="text-xs mt-1">Calendar</span>
        </button>
        <button className="flex flex-col items-center text-gray-500">
          <Settings size={20} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
      
      {/* Add Task Modal */}
      {showAddTask && (
        <div className="absolute inset-0 bg-black/50 flex items-end justify-center z-20">
          <div className="bg-white rounded-t-2xl w-full p-5 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Add new task</h3>
              <button onClick={() => setShowAddTask(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task name</label>
                <input
                  type="text"
                  placeholder="Enter task name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-500" />
                  </div>
                  <input 
                    type="date" 
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                  />
                </div>
              </div>
              
              <button 
                className="w-full bg-purple-600 text-white font-medium py-3 rounded-lg hover:bg-purple-700 transition-colors"
                onClick={addTask}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification */}
      {showNotification && (
        <div className="absolute top-16 left-0 right-0 flex justify-center">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
            {tasks.length > 0 ? "Task operation successful!" : "Tasks imported successfully!"}
          </div>
        </div>
      )}
    </div>
  );
}