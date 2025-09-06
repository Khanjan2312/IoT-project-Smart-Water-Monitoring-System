import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import DeviceManagement from '@/components/DeviceManagement';
import Analytics from '@/components/Analytics';
import Settings from '@/components/Settings';
import { useToast } from '@/components/ui/use-toast';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [waterData, setWaterData] = useState({
    currentUsage: 0,
    dailyUsage: 0,
    monthlyUsage: 0,
    leakDetected: false,
    devices: []
  });
  const { toast } = useToast();

  // Simulate real-time water usage data
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterData(prev => {
        const newUsage = Math.random() * 50 + 10; // 10-60 L/min
        const isLeak = newUsage > 45; // Threshold for leak detection
        
        if (isLeak && !prev.leakDetected) {
          toast({
            title: "🚨 Leak Detected!",
            description: "High water flow detected in Kitchen Sink. Please check immediately.",
            variant: "destructive",
            duration: 10000
          });
        }

        return {
          ...prev,
          currentUsage: newUsage,
          dailyUsage: prev.dailyUsage + (newUsage / 60), // Convert to hourly approximation
          leakDetected: isLeak
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [toast]);

  // Initialize demo data
  useEffect(() => {
    const savedData = localStorage.getItem('waterMonitoringData');
    if (savedData) {
      setWaterData(JSON.parse(savedData));
    } else {
      const initialData = {
        currentUsage: 25.4,
        dailyUsage: 180.5,
        monthlyUsage: 4200,
        leakDetected: false,
        devices: [
          { id: 1, name: 'Kitchen Sink', status: 'active', usage: 25.4, location: 'Kitchen' },
          { id: 2, name: 'Bathroom Shower', status: 'active', usage: 0, location: 'Bathroom' },
          { id: 3, name: 'Garden Sprinkler', status: 'inactive', usage: 0, location: 'Garden' },
          { id: 4, name: 'Washing Machine', status: 'active', usage: 12.8, location: 'Laundry' }
        ]
      };
      setWaterData(initialData);
      localStorage.setItem('waterMonitoringData', JSON.stringify(initialData));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('waterMonitoringData', JSON.stringify(waterData));
  }, [waterData]);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard waterData={waterData} />;
      case 'devices':
        return <DeviceManagement waterData={waterData} setWaterData={setWaterData} />;
      case 'analytics':
        return <Analytics waterData={waterData} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard waterData={waterData} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>AquaGuard - Smart Water Monitoring System</title>
        <meta name="description" content="Monitor your household water usage in real-time and detect leaks instantly with our IoT-based smart water monitoring solution." />
        <meta property="og:title" content="AquaGuard - Smart Water Monitoring System" />
        <meta property="og:description" content="Monitor your household water usage in real-time and detect leaks instantly with our IoT-based smart water monitoring solution." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} waterData={waterData} />
        
        <main className="container mx-auto px-4 py-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderActiveComponent()}
          </motion.div>
        </main>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;