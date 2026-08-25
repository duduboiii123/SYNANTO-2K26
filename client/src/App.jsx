import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Play from './pages/Play';
import Leaderboard from './pages/Leaderboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import IntroScreen from './components/intro/IntroScreen';

function AppContent() {
  const location = useLocation();
  const isPlayPage = location.pathname === '/play';

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-[#070a12] text-slate-100">
      
      {/* Ambient background glow orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[150px] pointer-events-none z-0"></div>
      <div className="fixed top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-amber-500/08 blur-[120px] pointer-events-none z-0"></div>

      {/* Top Glass Navbar on every page */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Hide footer on /play so mobile game fits in 100dvh without scrolling */}
      {!isPlayPage && <Footer />}

    </div>
  );
}

function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('synanto_intro_seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleFinishIntro = () => {
    sessionStorage.setItem('synanto_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <BrowserRouter>
      {showIntro && <IntroScreen onFinish={handleFinishIntro} />}
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
