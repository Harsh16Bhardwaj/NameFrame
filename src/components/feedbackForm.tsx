import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import Confetti from "react-confetti";

interface FormData {
  name: string;
  email: string;
  rating: number;
  bugs: string;
  navigation: number;
  message: string;
}

const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    rating: 0,
    bugs: "",
    navigation: 0,
    message: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarClick = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit feedback");
      }

      setSuccess(result.message);
      setShowConfetti(true);
      setFormData({ name: "", email: "", rating: 0, bugs: "", navigation: 0, message: "" });
      setTimeout(() => {
        setShowConfetti(false);
        setIsOpen(false);
        setIsSubmitting(false);
      }, 3000); // Close form after confetti
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ name, value, onStarClick }: { name: string; value: number; onStarClick: (name: string, value: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 cursor-pointer ${star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
          onClick={() => onStarClick(name, star)}
        />
      ))}
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={200} />}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-[var(--love)] to-[var(--love-text)] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          Please leave a Feedback :)
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-14 right-0 w-80 bg-gradient-to-br from-slate-900 to-slate-950 rounded-lg p-5 border border-[#4b3a70]/30 shadow-xl backdrop-blur-xl"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-[#c5c3c4] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-center bg-gradient-to-br from-[#aa8ac7] via-[#ffffff] to-[#491974] text-transparent bg-clip-text mb-4">
              Feedback
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#c5c3c4] mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-2 py-1 bg-gray-800/50 border border-[#4b3a70]/30 rounded text-white text-sm focus:outline-none focus:border-[#b7a2c9]"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-xs text-[#c5c3c4] mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-2 py-1 bg-gray-800/50 border border-[#4b3a70]/30 rounded text-white text-sm focus:outline-none focus:border-[#b7a2c9]"
                  placeholder="Your email"
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs text-[#c5c3c4] mb-1">Your Experience</label>
                  <StarRating name="rating" value={formData.rating} onStarClick={handleStarClick} />
                </div>
                <div>
                  <label className="block text-xs text-[#c5c3c4] mb-1">Navigation Ease</label>
                  <StarRating name="navigation" value={formData.navigation} onStarClick={handleStarClick} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#c5c3c4] mb-1">Quick Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-2 py-1 h-20 bg-gray-800/50 border border-[#4b3a70]/30 rounded text-white text-sm focus:outline-none focus:border-[#b7a2c9]"
                  placeholder="Your thoughts"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-xs text-[#c5c3c4] mb-1">Bugs (Optional)</label>
                <textarea
                  name="bugs"
                  value={formData.bugs}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-2 py-1 bg-gray-800/50 border border-[#4b3a70]/30 rounded text-white text-sm focus:outline-none focus:border-[#b7a2c9]"
                  placeholder="Any bugs?"
                  rows={2}
                />
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              {success && <p className="text-green-400 text-xs">{success}</p>}
              {isSubmitting && <p className="text-blue-400 text-xs">Submitting your feedback...</p>}
              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 text-white text-sm font-semibold rounded ${
                  isSubmitting
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-[var(--love)] to-[var(--love-text)] hover:from-[var(--love-text)] hover:to-[var(--love)]"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackForm;