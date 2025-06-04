
import { useState } from "react";
import MobileNav from "@/components/MobileNav";
import AddMovie from "@/components/AddMovie";
import MovieList from "@/components/MovieList";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'add' | 'list'>('add');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen">
        <MobileNav currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="pt-16 pb-20 px-4">
          {currentPage === 'add' ? <AddMovie /> : <MovieList />}
        </main>
      </div>
    </div>
  );
};

export default Index;
