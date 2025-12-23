import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Trash, LogOut, LayoutGrid, Award, MessageSquare } from 'lucide-react'

export default function Dashboard() {
    const [projects, setProjects] = useState([])
    const [tab, setTab] = useState('projects')
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('adminToken')
        if (!token) {
            navigate('/admin/login')
            return
        }
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/projects')
            setProjects(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('adminToken')
        navigate('/admin/login')
    }

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/10 p-6 flex flex-col">
                <h1 className="text-xl font-bold mb-12">Dashboard</h1>

                <nav className="space-y-2 flex-grow">
                    <button
                        onClick={() => setTab('projects')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${tab === 'projects' ? 'bg-accent-blue' : 'hover:bg-white/5'}`}
                    >
                        <LayoutGrid size={18} /> Projects
                    </button>
                    <button
                        onClick={() => setTab('skills')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${tab === 'skills' ? 'bg-accent-blue' : 'hover:bg-white/5'}`}
                    >
                        <Award size={18} /> Skills
                    </button>
                    <button
                        onClick={() => setTab('messages')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${tab === 'messages' ? 'bg-accent-blue' : 'hover:bg-white/5'}`}
                    >
                        <MessageSquare size={18} /> Messages
                    </button>
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-10">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold capitalize">{tab}</h2>
                    {tab === 'projects' && (
                        <button className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-white/90 transition-colors">
                            <Plus size={18} /> Add Project
                        </button>
                    )}
                </div>

                {tab === 'projects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div key={project._id} className="p-6 rounded-2xl bg-white/5 border border-white/10 group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold">{project.title}</h3>
                                    <button className="text-white/20 hover:text-red-500 transition-colors">
                                        <Trash size={18} />
                                    </button>
                                </div>
                                <p className="text-sm text-white/40 mb-4">{project.description}</p>
                                <div className="flex gap-2">
                                    {project.tags?.map(t => (
                                        <span key={t} className="px-2 py-1 bg-white/5 rounded text-[10px] uppercase font-bold text-white/30">{t}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="col-span-full py-20 text-center text-white/20">
                                No projects found. Add your first project!
                            </div>
                        )}
                    </div>
                )}

                {tab === 'skills' && <div className="text-white/40">Skills management coming soon...</div>}
                {tab === 'messages' && <div className="text-white/40">Messages inbox coming soon...</div>}
            </div>
        </div>
    )
}
