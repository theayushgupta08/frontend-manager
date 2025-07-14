"use client";

import { FaGithub, FaLinkedin, FaTwitter, FaReact, FaNodeJs } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiExpress, SiTypescript } from "react-icons/si";

export default function AboutMe() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-xl w-full bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-2xl p-8 border border-blue-100 dark:border-gray-700 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 text-center text-gray-800 dark:text-white drop-shadow-sm tracking-tight">👤 About the Creator</h1>
        <p className="text-gray-700 dark:text-gray-200 text-lg text-center mb-6">
          Hi! I'm <span className="font-bold">Ayush Gupta</span>, a passionate developer who loves building beautiful, modern web apps.<br/>
          This Personal Notes & Bookmark Manager was crafted to help you organize your digital life with ease and style.
        </p>
        <div className="flex gap-6 mb-8 justify-center">
          <a href="https://github.com/theayushgupta08" target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-200 hover:text-black dark:hover:text-white text-2xl transition" title="GitHub"><FaGithub /></a>
          <a href="https://linkedin.com/in/theayushgupta08" target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-400 hover:text-black dark:hover:text-white text-2xl transition" title="LinkedIn"><FaLinkedin /></a>
          <a href="https://twitter.com/theayushgupta08" target="_blank" rel="noopener noreferrer" className="text-blue-400 dark:text-blue-300 hover:text-black dark:hover:text-white text-2xl transition" title="Twitter"><FaTwitter /></a>
        </div>
        <div className="w-full">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">🛠️ Tech Stack Used</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-800 dark:text-gray-200 font-semibold text-base"><FaReact className="text-sky-500" /> React</span>
            <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-800 dark:text-gray-200 font-semibold text-base"><SiNextdotjs className="text-black dark:text-white" /> Next.js</span>
            <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-800 dark:text-gray-200 font-semibold text-base"><SiTailwindcss className="text-cyan-400" /> Tailwind CSS</span>
            <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-800 dark:text-gray-200 font-semibold text-base"><FaNodeJs className="text-green-600" /> Node.js</span>
            <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-800 dark:text-gray-200 font-semibold text-base"><SiExpress className="text-gray-700 dark:text-gray-200" /> Express</span>
            <span className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-800 dark:text-gray-200 font-semibold text-base"><SiTypescript className="text-blue-600" /> TypeScript</span>
          </div>
        </div>
      </div>
    </div>
  );
} 