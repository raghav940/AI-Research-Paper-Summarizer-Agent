import React from 'react';
import Sidebar from '../components/Sidebar';
import UploadArea from '../components/UploadArea';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        <div className="flex-1 flex items-center justify-center p-8">
          <UploadArea />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
