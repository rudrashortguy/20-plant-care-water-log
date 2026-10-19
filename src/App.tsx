import React, { useState } from 'react';
import { useFloraStore } from './store';
import { Leaf, Droplets, Calendar, BookOpen, BarChart2, Plus, Search, Sun, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function App() {
  const { plants, journalEntries, tasks, activeTab, setActiveTab, waterPlant, addPlant, toggleTask, deletePlant } = useFloraStore();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  // New plant form state
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [room, setRoom] = useState('Living Room');
  const [wateringIntervalDays, setWateringIntervalDays] = useState(7);
  const [light, setLight] = useState<'Direct' | 'Bright Indirect' | 'Medium' | 'Low'>('Bright Indirect');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=600');

  const filteredPlants = plants.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.species.toLowerCase().includes(search.toLowerCase()) ||
    p.room.toLowerCase().includes(search.toLowerCase())
  );

  const getDaysUntilWater = (lastWatered: string, interval: number) => {
    const last = new Date(lastWatered).getTime();
    const next = last + interval * 86400000;
    const diffDays = Math.ceil((next - Date.now()) / 86400000);
    return diffDays;
  };

  const handleCreatePlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addPlant({
      name,
      species,
      room,
      wateringIntervalDays: Number(wateringIntervalDays),
      lastWatered: new Date().toISOString(),
      light,
      notes,
      imageUrl,
      health: 'Thriving'
    });
    setName('');
    setSpecies('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const selectedPlant = plants.find(p => p.id === selectedPlantId);

  return (
    <div className="min-h-screen bg-forest-50 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden pb-20">
      {/* Header */}
      <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-forest-600 text-white p-2 rounded-xl shadow-md">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-forest-900 tracking-tight">FloraLog</h1>
            <p className="text-xs text-slate-500">Your Botanical Sanctuary</p>
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-forest-600 hover:bg-forest-700 text-white p-2.5 rounded-full shadow-lg transition transform active:scale-95 flex items-center justify-center"
        >
          <Plus className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === 'plants' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search plants, species, rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 shadow-sm"
              />
            </div>

            {/* Plant Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredPlants.map(plant => {
                const daysLeft = getDaysUntilWater(plant.lastWatered, plant.wateringIntervalDays);
                const isOverdue = daysLeft <= 0;
                return (
                  <div
                    key={plant.id}
                    onClick={() => setSelectedPlantId(plant.id)}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col justify-between cursor-pointer hover:shadow-md transition group"
                  >
                    <div>
                      <div className="relative h-32 rounded-xl overflow-hidden mb-3 bg-slate-100">
                        <img
                          src={plant.imageUrl}
                          alt={plant.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm ${
                          plant.health === 'Thriving' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {plant.health}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-800 text-sm truncate">{plant.name}</h3>
                      <p className="text-xs text-slate-400 italic truncate">{plant.species}</p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="flex items-center text-slate-500">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        {plant.room}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          waterPlant(plant.id);
                        }}
                        className={`px-2 py-1 rounded-lg font-medium flex items-center space-x-1 transition ${
                          isOverdue
                            ? 'bg-rose-500 text-white hover:bg-rose-600'
                            : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
                        }`}
                        title="Water plant"
                      >
                        <Droplets className="w-3 h-3" />
                        <span>{isOverdue ? 'Water Now' : `${daysLeft}d`}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredPlants.length === 0 && (
              <div className="text-center py-12">
                <Leaf className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No plants found in your sanctuary.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-slate-800 mb-2">Care Schedule & Tasks</h2>
            <div className="space-y-2.5">
              {tasks.map(task => (
                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                        task.completed ? 'bg-forest-600 border-forest-600 text-white' : 'border-slate-300'
                      }`}
                    >
                      {task.completed && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <div>
                      <h4 className={`font-semibold text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.taskType} {task.plantName}
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center mt-0.5">
                        <Clock className="w-3 h-3 mr-1" /> Due: {task.dueDate}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-700 font-medium rounded-lg">
                    Pending
                  </span>
                </div>
              ))}

              {plants.map(plant => {
                const daysLeft = getDaysUntilWater(plant.lastWatered, plant.wateringIntervalDays);
                return (
                  <div key={'auto-' + plant.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100">
                        <img src={plant.imageUrl} alt={plant.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800">Water {plant.name}</h4>
                        <p className="text-xs text-slate-400">
                          {daysLeft <= 0 ? 'Overdue!' : `Due in ${daysLeft} days`} ({plant.room})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => waterPlant(plant.id)}
                      className="bg-forest-50 hover:bg-forest-100 text-forest-700 px-3 py-1.5 rounded-xl font-medium text-xs flex items-center space-x-1"
                    >
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Water</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-slate-800 mb-2">Plant Photo Journal</h2>
            <div className="space-y-4">
              {journalEntries.map(entry => {
                const plant = plants.find(p => p.id === entry.plantId);
                return (
                  <div key={entry.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 font-bold text-xs">
                          {plant?.name?.[0] || 'P'}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-slate-800">{plant?.name || 'Unknown Plant'}</h4>
                          <p className="text-[10px] text-slate-400">{new Date(entry.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{entry.note}</p>
                    {entry.imageUrl && (
                      <div className="rounded-xl overflow-hidden h-48 bg-slate-100">
                        <img src={entry.imageUrl} alt="Journal" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-slate-800 mb-2">Sanctuary Overview</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
                <Leaf className="w-6 h-6 text-forest-600 mx-auto mb-1" />
                <span className="text-2xl font-bold text-slate-800">{plants.length}</span>
                <p className="text-xs text-slate-400">Total Plants</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
                <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <span className="text-2xl font-bold text-slate-800">{journalEntries.length}</span>
                <p className="text-xs text-slate-400">Care Logs</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <h3 className="font-semibold text-sm text-slate-800">Health Breakdown</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Thriving</span>
                  <span className="font-bold text-emerald-600">{plants.filter(p => p.health === 'Thriving').length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Needs Attention</span>
                  <span className="font-bold text-amber-600">{plants.filter(p => p.health === 'Needs Attention').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Plant Detail Modal / Drawer */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center max-w-md mx-auto">
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-forest-600 bg-forest-50 px-2.5 py-1 rounded-full">
                  {selectedPlant.room}
                </span>
                <h2 className="text-xl font-bold text-slate-800 mt-1">{selectedPlant.name}</h2>
                <p className="text-xs text-slate-400 italic">{selectedPlant.species}</p>
              </div>
              <button
                onClick={() => setSelectedPlantId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-48 bg-slate-100">
              <img src={selectedPlant.imageUrl} alt={selectedPlant.name} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block mb-1">Watering Schedule</span>
                <span className="font-bold text-slate-700">Every {selectedPlant.wateringIntervalDays} days</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl">
                <span className="text-slate-400 block mb-1">Light Requirement</span>
                <span className="font-bold text-slate-700 flex items-center">
                  <Sun className="w-3.5 h-3.5 text-amber-500 mr-1" />
                  {selectedPlant.light}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <span className="text-slate-400 font-medium">Care Notes</span>
              <p className="text-slate-600">{selectedPlant.notes || 'No notes added yet.'}</p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  waterPlant(selectedPlant.id);
                  setSelectedPlantId(null);
                }}
                className="flex-1 bg-forest-600 hover:bg-forest-700 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 shadow-md"
              >
                <Droplets className="w-4 h-4" />
                <span>Water Now</span>
              </button>
              <button
                onClick={() => {
                  deletePlant(selectedPlant.id);
                  setSelectedPlantId(null);
                }}
                className="px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Plant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center max-w-md mx-auto">
          <form onSubmit={handleCreatePlant} className="bg-white w-full rounded-t-3xl p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Add New Plant</h2>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Plant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monstera Pete"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Species</label>
                <input
                  type="text"
                  placeholder="e.g. Monstera deliciosa"
                  value={species}
                  onChange={e => setSpecies(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Room</label>
                  <select
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  >
                    <option>Living Room</option>
                    <option>Bedroom</option>
                    <option>Kitchen</option>
                    <option>Sunroom</option>
                    <option>Bathroom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1 font-medium">Water Interval (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={wateringIntervalDays}
                    onChange={e => setWateringIntervalDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Light Level</label>
                <select
                  value={light}
                  onChange={e => setLight(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option>Bright Indirect</option>
                  <option>Direct</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-500 mb-1 font-medium">Care Notes</label>
                <textarea
                  placeholder="Add watering tips or notes..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-forest-500 h-20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-forest-600 hover:bg-forest-700 text-white py-3 rounded-xl font-medium text-sm shadow-md transition"
            >
              Add Plant to Sanctuary
            </button>
          </form>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-2 flex justify-between items-center z-10 shadow-lg">
        <button
          onClick={() => setActiveTab('plants')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'plants' ? 'text-forest-600' : 'text-slate-400'}`}
        >
          <Leaf className="w-5 h-5" />
          <span className="text-[10px] font-medium">Plants</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'schedule' ? 'text-forest-600' : 'text-slate-400'}`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium">Schedule</span>
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'journal' ? 'text-forest-600' : 'text-slate-400'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">Journal</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center space-y-1 ${activeTab === 'stats' ? 'text-forest-600' : 'text-slate-400'}`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Stats</span>
        </button>
      </nav>
    </div>
  );
}
