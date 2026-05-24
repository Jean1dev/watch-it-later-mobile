
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MobileNav from "@/components/MobileNav";
import AddMovie from "@/components/AddMovie";
import MovieList from "@/components/MovieList";
import WatchedList from "@/components/WatchedList";

type Page = 'add' | 'list' | 'watched';

const Index = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<Page>('add');

  useEffect(() => {
    if (location.state && (location.state as any).goTo === 'list') {
      setCurrentPage('list');
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen">
        <MobileNav currentPage={currentPage} onPageChange={setCurrentPage} />

        <main className="pt-16 pb-20 px-4">
          {currentPage === 'add' && <AddMovie />}
          {currentPage === 'list' && <MovieList />}
          {currentPage === 'watched' && <WatchedList />}
        </main>
      </div>
    </div>
  );
};

export default Index;
