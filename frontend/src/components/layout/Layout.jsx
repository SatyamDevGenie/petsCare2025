import { Outlet } from 'react-router-dom';
import Header from './Header';
import AiChatWidget from '../AiChatWidget';

export default function Layout() {
  return (
    <div className="min-h-screen theme-bg-main theme-text">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>
      <AiChatWidget />
    </div>
  );
}
