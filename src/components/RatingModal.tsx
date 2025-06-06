import { Star } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRate: (rating: number | null) => void;
  title: string;
}

const RatingModal = ({ isOpen, onClose, onRate, title }: RatingModalProps) => {
  const [rating, setRating] = useState<number | null>(null);

  const handleRate = () => {
    onRate(rating);
    setRating(null);
    onClose();
  };

  const handleSkip = () => {
    onRate(null);
    setRating(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar {title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  size={32}
                  className={`${
                    rating && star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  } hover:text-yellow-400 hover:fill-yellow-400 transition-colors`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="px-6"
            >
              Pular
            </Button>
            <Button
              onClick={handleRate}
              disabled={!rating}
              className="px-6"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal; 