import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'

export default function ProjectCard({ project, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-card-bg border border-card-border hover:border-accent-blue/30 transition-all duration-300"
        >
            <div className="aspect-video overflow-hidden">
                <img
                    src={project.image || 'https://via.placeholder.com/600x400?text=Project+Image'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                />
            </div>
            <div className="p-6">
                <h4 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
                    {project.title}
                </h4>
                <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags?.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-white/5 rounded text-[10px] font-semibold uppercase tracking-wider text-foreground/40">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex gap-4">
                    {project.githubLink && (
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 rounded-full hover:bg-accent-blue/20 transition-colors"
                        >
                            <Github size={18} />
                        </a>
                    )}
                    {project.liveLink && (
                        <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 rounded-full hover:bg-accent-blue/20 transition-colors"
                        >
                            <ExternalLink size={18} />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
