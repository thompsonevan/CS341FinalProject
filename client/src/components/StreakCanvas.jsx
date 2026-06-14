import { useEffect, useRef } from "react";

export default function StreakCanvas({ habits }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const padding = 24;
    const barWidth = 36;
    const gap = 18;
    const maxValue = Math.max(...habits.map((habit) => habit.streak), 1);

    context.clearRect(0, 0, width, height);
    context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--surface");
    context.fillRect(0, 0, width, height);

    habits.slice(0, 5).forEach((habit, index) => {
      const barHeight = ((habit.streak / maxValue) * (height - padding * 2)) || 8;
      const x = padding + index * (barWidth + gap);
      const y = height - padding - barHeight;

      context.fillStyle = habit.color;
      context.fillRect(x, y, barWidth, barHeight);

      context.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--text-muted");
      context.font = "12px Segoe UI, sans-serif";
      context.fillText(habit.name.slice(0, 8), x, height - 8);
      context.fillText(String(habit.streak), x + 8, y - 6);
    });
  }, [habits]);

  return (
    <section className="card canvas-card">
      <h3>Streak Visualization</h3>
      <p className="card-copy">Canvas chart showing your top habit streaks.</p>
      <canvas ref={canvasRef} width="420" height="220" aria-label="Habit streak bar chart"></canvas>
    </section>
  );
}
