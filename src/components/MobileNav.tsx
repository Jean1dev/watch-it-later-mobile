
import { useState } from "react";
import { Menu, Plus, List, X } from "lucide-react";

interface MobileNavProps {
  currentPage: 'add' | 'list';
  onPageChange: (page: 'add' | 'list') => void;
}

const MobileNav = ({ currentPage, onPageChange }: MobileNavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handlePageChange = (page: 'add' | 'list') => {
    onPageChange(page);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-sm shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {currentPage === 'add' ? 'Adicionar' : 'Minha Lista'}
          </h1>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg active:scale-95 transition-transform"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={toggleMenu}>
          <div className="fixed top-16 right-4 bg-white rounded-2xl shadow-xl p-2 z-50 max-w-md">
            <nav className="space-y-1">
              <button
                onClick={() => handlePageChange('add')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === 'add' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Plus size={20} />
                <span className="font-medium">Adicionar</span>
              </button>
              
              <button
                onClick={() => handlePageChange('list')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === 'list' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List size={20} />
                <span className="font-medium">Minha Lista</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
