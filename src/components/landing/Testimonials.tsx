import { testimonials } from "@/data/testimonials";
import Image from "next/image";

// Helper function to darken a hex color
const darkenColor = (hex :any, percent :any) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - Math.round((num >> 16) * percent / 100));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(((num >> 8) & 0x00FF) * percent / 100));
  const b = Math.max(0, (num & 0x0000FF) - Math.round((num & 0x0000FF) * percent / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// Helper function to lighten a hex color for shadow
const lightenColor = (hex :any, percent :any) => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + Math.round((255 - (num >> 16)) * percent / 100));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round((255 - ((num >> 8) & 0x00FF)) * percent / 100));
  const b = Math.min(255, (num & 0x0000FF) + Math.round((255 - (num & 0x0000FF)) * percent / 100));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

export default function Testimonials() {
  const items = testimonials;
  const bgColors = ["#4eb3a3", "#4C72B0", "#E94560", "#470f51", "#0d2138"];

  // Shuffle colors to ensure randomness
  const shuffledColors = [...bgColors].sort(() => Math.random() - 0.5);

  return (
    <section className="py-24 bg-[#000000] relative overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-white mb-16">
          What People Say
        </h2>

        <div className="grid grid-cols-6 auto-rows-[170px] gap-6">
          {/* Card 1 */}
          <div className="col-span-4 row-span-1 card" style={{ 
            backgroundColor: `rgba(${parseInt(shuffledColors[0].slice(1, 3), 16)}, ${parseInt(shuffledColors[0].slice(3, 5), 16)}, ${parseInt(shuffledColors[0].slice(5, 7), 16)}, 0.2)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${darkenColor(shuffledColors[0], 20)}`,
            boxShadow: `2px 3px 10px ${darkenColor(shuffledColors[0], 20)}`
          }}>
            <p style={{ color: "#d3d3d3" }}>“{items[0].text}”</p>
            <div>
              <div style={{ color: "#ffffff" }}>{items[0].name}</div>
              <div style={{ color: "#a2a2a2" }}>{items[0].role}</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-2 row-span-1 card" style={{ 
            backgroundColor: `rgba(${parseInt(shuffledColors[1].slice(1, 3), 16)}, ${parseInt(shuffledColors[1].slice(3, 5), 16)}, ${parseInt(shuffledColors[1].slice(5, 7), 16)}, 0.2)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${darkenColor(shuffledColors[1], 20)}`,
            boxShadow: `2px 3px 10px ${darkenColor(shuffledColors[1], 20)}`
          }}>
            <p style={{ color: "#d3d3d3" }}>“{items[1].text}”</p>
            <div>
              <div style={{ color: "#ffffff" }}>{items[1].name}</div>
              <div style={{ color: "#a2a2a2" }}>{items[1].role}</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-span-3 row-span-1 card" style={{ 
            backgroundColor: `rgba(${parseInt(shuffledColors[2].slice(1, 3), 16)}, ${parseInt(shuffledColors[2].slice(3, 5), 16)}, ${parseInt(shuffledColors[2].slice(5, 7), 16)}, 0.2)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${darkenColor(shuffledColors[2], 20)}`,
            boxShadow: `2px 3px 10px ${darkenColor(shuffledColors[2], 20)}`
          }}>
            <p style={{ color: "#d3d3d3" }}>“{items[2].text}”</p>
            <div>
              <div style={{ color: "#ffffff" }}>{items[2].name}</div>
              <div style={{ color: "#a2a2a2" }}>{items[2].role}</div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-span-1 row-span-2 card" style={{ 
            backgroundColor: `rgba(${parseInt(shuffledColors[3].slice(1, 3), 16)}, ${parseInt(shuffledColors[3].slice(3, 5), 16)}, ${parseInt(shuffledColors[3].slice(5, 7), 16)}, 0.2)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${darkenColor(shuffledColors[3], 20)}`,
            boxShadow: `2px 3px 10px ${darkenColor(shuffledColors[3], 20)}`
          }}>
            <p style={{ color: "#d3d3d3" }}>“{items[3].text}”</p>
            <div>
              <div style={{ color: "#ffffff" }}>{items[3].name}</div>
              <div style={{ color: "#a2a2a2" }}>{items[3].role}</div>
            </div>
          </div>

          <div className="col-span-2 row-span-1 card" style={{ 
            backgroundColor: `rgba(${parseInt(shuffledColors[4].slice(1, 3), 16)}, ${parseInt(shuffledColors[4].slice(3, 5), 16)}, ${parseInt(shuffledColors[4].slice(5, 7), 16)}, 0.2)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${darkenColor(shuffledColors[4], 20)}`,
            boxShadow: `2px 3px 10px ${darkenColor(shuffledColors[4], 20)}`
          }}>
            <p style={{ color: "#d3d3d3" }}>“{items[6].text}”</p>
            <div>
              <div style={{ color: "#ffffff" }}>{items[6].name}</div>
              <div style={{ color: "#a2a2a2" }}>{items[6].role}</div>
            </div>
          </div>

          <div className="col-span-2 row-span-2 card" style={{ 
            backgroundColor: `rgba(${parseInt(shuffledColors[0].slice(1, 3), 16)}, ${parseInt(shuffledColors[0].slice(3, 5), 16)}, ${parseInt(shuffledColors[0].slice(5, 7), 16)}, 0.2)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${darkenColor(shuffledColors[0], 20)}`,
            boxShadow: `2px 3px 10px ${darkenColor(shuffledColors[0], 20)}`
          }}>
            <p style={{ color: "#d3d3d3" }}>“{items[7].text}”</p>
            <div>
              <div style={{ color: "#ffffff" }}>{items[7].name}</div>
              <div style={{ color: "#a2a2a2" }}>{items[7].role}</div>
            </div>
          </div>

          <div className="col-span-1 row-span-1 card" style={{ 
            backgroundColor: `rgba(${parseInt(shuffledColors[1].slice(1, 3), 16)}, ${parseInt(shuffledColors[1].slice(3, 5), 16)}, ${parseInt(shuffledColors[1].slice(5, 7), 16)}, 0.2)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${darkenColor(shuffledColors[1], 20)}`,
            boxShadow: `2px 3px 10px ${darkenColor(shuffledColors[1], 20)}`
          }}>
            <div>
              <Image src="/nameframelogo.png" alt="Nameframe Logo" className="flex justify-center items-center w-full h-full" width={100} height={100} />
            </div>
          </div>

          {/* Card 5 */}
          <div className="col-span-2 row-span-1 card" style={{ 
            backgroundColor: `rgba(${parseInt(shuffledColors[2].slice(1, 3), 16)}, ${parseInt(shuffledColors[2].slice(3, 5), 16)}, ${parseInt(shuffledColors[2].slice(5, 7), 16)}, 0.2)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${darkenColor(shuffledColors[2], 20)}`,
            boxShadow: `2px 3px 10px${darkenColor(shuffledColors[2], 20)}`
          }}>
            <p style={{ color: "#d3d3d3" }}>“{items[4].text}”</p>
            <div>
              <div style={{ color: "#ffffff" }}>{items[4].name}</div>
              <div style={{ color: "#a2a2a2" }}>{items[4].role}</div>
            </div>
          </div>

          {/* Card 6 */}
          <div className="col-span-4 row-span-1 card" style={{ 
            backgroundColor: `rgba(${parseInt(shuffledColors[3].slice(1, 3), 16)}, ${parseInt(shuffledColors[3].slice(3, 5), 16)}, ${parseInt(shuffledColors[3].slice(5, 7), 16)}, 0.2)`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${darkenColor(shuffledColors[3], 20)}`,
            boxShadow: ` 2px 3px 10px ${darkenColor(shuffledColors[3], 20)}`
          }}>
            <p style={{ color: "#d3d3d3" }}>“{items[5].text}”</p>
            <div>
              <div style={{ color: "#ffffff" }}>{items[5].name}</div>
              <div style={{ color: "#a2a2a2 " }}>{items[5].role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Shared styles */}
      <style jsx>{`
        .card {
          border-radius: 1rem;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-4px);
        }
        .card p {
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card div div:first-child {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .card div div:last-child {
          font-size: 0.8rem;
        }
      `}</style>
    </section>
  );
}