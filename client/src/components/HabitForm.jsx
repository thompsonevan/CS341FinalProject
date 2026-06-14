import { useState } from "react";
import { HABIT_CATEGORIES } from "../utils/wellness";

const initialForm = {
  name: "",
  category: "fitness",
  frequency: "daily",
  targetDays: 7,
  color: "#0f766e",
  description: "",
  reminderEnabled: false,
  reminderTime: "morning",
};

export default function HabitForm({ onSubmit, submitLabel = "Create Habit" }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    const nextErrors = [];
    if (!form.name.trim()) nextErrors.push("Habit name is required.");
    if (form.name.trim().length < 2) nextErrors.push("Habit name must be at least 2 characters.");
    if (!form.category) nextErrors.push("Please choose a category.");
    if (!form.frequency) nextErrors.push("Please choose a frequency.");
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    await onSubmit({
      name: form.name.trim(),
      category: form.category,
      frequency: form.frequency,
      targetDays: Number(form.targetDays),
      color: form.color,
      description: form.description.trim(),
    });

    setForm(initialForm);
    setErrors([]);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <h3>Create a New Habit</h3>

      <label htmlFor="name">Habit Name</label>
      <input
        id="name"
        name="name"
        type="text"
        value={form.name}
        onChange={handleChange}
        placeholder="Morning walk"
        required
      />

      <label htmlFor="category">Category</label>
      <select id="category" name="category" value={form.category} onChange={handleChange} required>
        {HABIT_CATEGORIES.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>

      <fieldset>
        <legend>Frequency</legend>
        <label>
          <input
            type="radio"
            name="frequency"
            value="daily"
            checked={form.frequency === "daily"}
            onChange={handleChange}
          />
          Daily
        </label>
        <label>
          <input
            type="radio"
            name="frequency"
            value="weekly"
            checked={form.frequency === "weekly"}
            onChange={handleChange}
          />
          Weekly
        </label>
        <label>
          <input
            type="radio"
            name="frequency"
            value="custom"
            checked={form.frequency === "custom"}
            onChange={handleChange}
          />
          Custom
        </label>
      </fieldset>

      <label htmlFor="targetDays">Target Days Per Week</label>
      <input
        id="targetDays"
        name="targetDays"
        type="number"
        min="1"
        max="7"
        value={form.targetDays}
        onChange={handleChange}
      />

      <label htmlFor="color">Accent Color</label>
      <input id="color" name="color" type="color" value={form.color} onChange={handleChange} />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        rows="3"
        value={form.description}
        onChange={handleChange}
        placeholder="Why does this habit matter to you?"
      />

      <label className="checkbox-row">
        <input
          type="checkbox"
          name="reminderEnabled"
          checked={form.reminderEnabled}
          onChange={handleChange}
        />
        Enable reminder notifications
      </label>

      <label htmlFor="reminderTime">Reminder Time</label>
      <select
        id="reminderTime"
        name="reminderTime"
        value={form.reminderTime}
        onChange={handleChange}
        disabled={!form.reminderEnabled}
      >
        <option value="morning">Morning</option>
        <option value="afternoon">Afternoon</option>
        <option value="evening">Evening</option>
      </select>

      {errors.length > 0 && (
        <ul className="error-list" role="alert">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}
