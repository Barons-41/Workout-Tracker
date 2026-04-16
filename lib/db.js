import { supabase } from "./supabase";

// ── Session row ↔ app object ───────────────────────────────────────────────

function rowToSession(row) {
  const ex = row.exercises || {};
  return {
    id: row.id,
    date: ex.formattedDate || row.date,
    dateISO: row.date,
    dayId: row.day_name,
    dayLabel: ex.dayLabel || row.day_name,
    exercises: ex.items || [],
  };
}

function sessionToRow(session) {
  return {
    day_name: session.dayId,
    date: session.dateISO,
    exercises: {
      dayLabel: session.dayLabel,
      formattedDate: session.date,
      items: session.exercises,
    },
  };
}

// ── workout_sessions ───────────────────────────────────────────────────────

export async function fetchHistory() {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select("*")
    .order("date", { ascending: false });
  if (error) { console.error("fetchHistory:", error); return []; }
  return (data || []).map(rowToSession);
}

export async function insertSession(session) {
  const { data, error } = await supabase
    .from("workout_sessions")
    .insert(sessionToRow(session))
    .select()
    .single();
  if (error) { console.error("insertSession:", error); return null; }
  return rowToSession(data);
}

export async function deleteSession(id) {
  const { error } = await supabase
    .from("workout_sessions")
    .delete()
    .eq("id", id);
  if (error) console.error("deleteSession:", error);
}

export async function updateSession(id, { exercises, dateISO, dayLabel }) {
  const formattedDate = new Date(dateISO + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "short", month: "short", day: "numeric", year: "numeric" }
  );
  const { data, error } = await supabase
    .from("workout_sessions")
    .update({
      date: dateISO,
      exercises: { dayLabel, formattedDate, items: exercises },
    })
    .eq("id", id)
    .select()
    .single();
  if (error) { console.error("updateSession:", error); return null; }
  return rowToSession(data);
}

// ── split_config ───────────────────────────────────────────────────────────
// Each day is stored as one row; the full day object lives in `exercises` JSONB.

export async function fetchSplit() {
  const { data, error } = await supabase
    .from("split_config")
    .select("*")
    .order("day_index");
  if (error) { console.error("fetchSplit:", error); return null; }
  if (!data || data.length === 0) return null;
  return data.map((row) => row.exercises);
}

export async function saveSplit(splitArray) {
  // Delete all existing rows, then re-insert.
  const { error: delErr } = await supabase
    .from("split_config")
    .delete()
    .gte("day_index", 0);
  if (delErr) { console.error("saveSplit delete:", delErr); return; }

  const rows = splitArray.map((day, idx) => ({
    day_index: idx,
    day_name: day.id,
    exercises: day,
  }));
  const { error: insErr } = await supabase.from("split_config").insert(rows);
  if (insErr) console.error("saveSplit insert:", insErr);
}

// ── body_stats ─────────────────────────────────────────────────────────────

function rowToStat(row) {
  return {
    id: row.id,
    date: row.date,
    weight: row.weight,
    bf: row.body_fat,
    bmi: row.bmi,
    muscle: row.muscle_mass,
  };
}

export async function fetchBodyStats() {
  const { data, error } = await supabase
    .from("body_stats")
    .select("*")
    .order("date");
  if (error) { console.error("fetchBodyStats:", error); return []; }
  return (data || []).map(rowToStat);
}

export async function insertBodyStat(entry) {
  const { data, error } = await supabase
    .from("body_stats")
    .insert({
      date: entry.date,
      weight: entry.weight ?? null,
      body_fat: entry.bf ?? null,
      bmi: entry.bmi ?? null,
      muscle_mass: entry.muscle ?? null,
    })
    .select()
    .single();
  if (error) { console.error("insertBodyStat:", error); return null; }
  return rowToStat(data);
}

export async function deleteBodyStat(id) {
  const { error } = await supabase.from("body_stats").delete().eq("id", id);
  if (error) console.error("deleteBodyStat:", error);
}

// ── volume_ranges (localStorage – no dedicated table) ─────────────────────

export function getVolumeRanges() {
  try {
    const v = localStorage.getItem("volume_ranges");
    return v ? JSON.parse(v) : null;
  } catch { return null; }
}

export function saveVolumeRanges(ranges) {
  try {
    localStorage.setItem("volume_ranges", JSON.stringify(ranges));
  } catch {}
}
