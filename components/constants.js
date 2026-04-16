export const DEFAULT_SPLIT = [
  { id: "upper", label: "Upper", day: "Monday", color: "#1D9E75", exercises: [
    { name: "Flat Bench Press", muscles: "chest, triceps", repRange: "5-8" },
    { name: "T-Bar Row — Wide", muscles: "back, biceps", repRange: "6-10" },
    { name: "Incline DB Press", muscles: "chest, shoulders", repRange: "8-12" },
    { name: "Lat Pull Down — Wide", muscles: "back, biceps", repRange: "8-12" },
    { name: "DB Lateral Raise", muscles: "shoulders", repRange: "12-15" },
    { name: "Cable Fly", muscles: "chest", repRange: "8-12" },
    { name: "Tricep Push Down", muscles: "triceps", repRange: "8-12" },
    { name: "Cable Bicep Curl", muscles: "biceps", repRange: "8-12" },
    { name: "Cable Serratus Punch", muscles: "serratus", repRange: "10-15" },
    { name: "Cable Serratus Crunch", muscles: "serratus", repRange: "10-15" },
    { name: "Behind the Back Shoulder Shrugs", muscles: "traps", repRange: "10-15" },
    { name: "Wrist Curl", muscles: "forearms", repRange: "15" },
    { name: "Reverse Wrist Curl", muscles: "forearms", repRange: "15" },
    { name: "Push-Up Plus", muscles: "chest, serratus", repRange: "AMRAP" },
    { name: "Dips", muscles: "chest, triceps", repRange: "AMRAP" },
  ]},
  { id: "lower", label: "Lower + Abs", day: "Tuesday", color: "#378ADD", exercises: [
    { name: "Barbell Back Squat", muscles: "quads, glutes", repRange: "6-10" },
    { name: "Heel Elevated Smith Squat", muscles: "quads", repRange: "8-12" },
    { name: "Single-Leg Leg Press", muscles: "quads, glutes", repRange: "10-15" },
    { name: "Leg Extension", muscles: "quads", repRange: "10-15" },
    { name: "Single-Leg Leg Curl", muscles: "hamstrings", repRange: "10-15" },
    { name: "Hip Abduction", muscles: "glutes", repRange: "10-15" },
    { name: "Hip Adduction", muscles: "adductors", repRange: "10-15" },
    { name: "Standing Calf Raises", muscles: "calves", repRange: "15-20" },
    { name: "Decline Weighted Sit-Ups", muscles: "abs", repRange: "10-15" },
    { name: "Dragonflies", muscles: "abs", repRange: "15" },
    { name: "Cable Wood Choppers", muscles: "obliques", repRange: "12-15" },
  ]},
  { id: "accessory", label: "Accessory", day: "Wednesday", color: "#7F77DD", exercises: [
    { name: "Single-Arm Cable Lateral Raise", muscles: "shoulders", repRange: "12-15" },
    { name: "DB Lateral Raise", muscles: "shoulders", repRange: "12-15" },
    { name: "Cable Rear Delt Fly", muscles: "rear delts", repRange: "15-20" },
    { name: "EZ Bar Preacher Curl", muscles: "biceps", repRange: "10-12" },
    { name: "Hammer Curls", muscles: "biceps, brachialis", repRange: "10-15" },
    { name: "Single-Arm Tricep Tri-Set", muscles: "triceps", repRange: "10-12" },
    { name: "Flat Skull Crushers", muscles: "triceps", repRange: "10-15" },
    { name: "Cable Serratus Punch", muscles: "serratus", repRange: "10-15" },
    { name: "Cable Serratus Crunch", muscles: "serratus", repRange: "10-15" },
    { name: "Serratus Wall Slides", muscles: "serratus", repRange: "8-12" },
    { name: "Palof Press", muscles: "core", repRange: "12-15" },
    { name: "Wrist Curl", muscles: "forearms", repRange: "15" },
    { name: "Reverse Wrist Curl", muscles: "forearms", repRange: "15" },
  ]},
  { id: "chest_back", label: "Chest/Back Hyp.", day: "Thursday", color: "#D85A30", exercises: [
    { name: "Incline Smith Bench", muscles: "chest, shoulders", repRange: "6-10" },
    { name: "T-Bar Row — Narrow", muscles: "back", repRange: "10-12" },
    { name: "Flat DB Bench Press", muscles: "chest", repRange: "8-12" },
    { name: "Close-Grip Lat Pull Down", muscles: "back, biceps", repRange: "8-12" },
    { name: "Single-Arm Lat Pull Down", muscles: "back", repRange: "8-12" },
    { name: "Straight Arm Pull Down", muscles: "back", repRange: "12-15" },
    { name: "Seated Cable Row", muscles: "back", repRange: "8-12" },
    { name: "Low-to-High Cable Fly", muscles: "chest", repRange: "12-15" },
    { name: "Pec Dec", muscles: "chest", repRange: "8-12" },
    { name: "Push-Up Plus", muscles: "chest, serratus", repRange: "AMRAP" },
    { name: "Dips", muscles: "chest, triceps", repRange: "AMRAP" },
  ]},
  { id: "shoulders_arms", label: "Shoulders/Arms", day: "Friday", color: "#BA7517", exercises: [
    { name: "DB Shoulder Press", muscles: "shoulders", repRange: "6-10" },
    { name: "Cable Lateral Raise", muscles: "shoulders", repRange: "12-15" },
    { name: "DB Lateral Raise", muscles: "shoulders", repRange: "12-15" },
    { name: "Single-Arm Rear Delt Fly", muscles: "rear delts", repRange: "12-15" },
    { name: "Incline DB Curl", muscles: "biceps", repRange: "8-12" },
    { name: "Hammer Curls", muscles: "biceps, brachialis", repRange: "10-12" },
    { name: "Incline Skull Crushers", muscles: "triceps", repRange: "8-12" },
    { name: "Rope Push Down", muscles: "triceps", repRange: "8-12" },
    { name: "V-Bar Overhead Tricep Extension", muscles: "triceps", repRange: "10-12" },
    { name: "Partial Cable Lateral Raise — Top Half", muscles: "shoulders", repRange: "15-20" },
    { name: "Cable Y-Raise", muscles: "shoulders, traps", repRange: "8-12" },
    { name: "DB Shoulder Shrugs", muscles: "traps", repRange: "12-15" },
    { name: "Wrist Curl", muscles: "forearms", repRange: "15" },
    { name: "Reverse Wrist Curl", muscles: "forearms", repRange: "15" },
  ]},
  { id: "legs_abs", label: "Legs + Abs", day: "Saturday", color: "#D4537E", exercises: [
    { name: "Smith RDL", muscles: "hamstrings, glutes", repRange: "6-10" },
    { name: "Seated Leg Curl", muscles: "hamstrings", repRange: "10-12" },
    { name: "Elevated Heel Smith Split Squat", muscles: "quads, glutes", repRange: "8-12" },
    { name: "Sumo Leg Press", muscles: "quads, glutes, adductors", repRange: "10-15" },
    { name: "Single-Leg Leg Extension", muscles: "quads", repRange: "10-12" },
    { name: "Hip Abduction", muscles: "glutes", repRange: "12-15" },
    { name: "Hip Adduction", muscles: "adductors", repRange: "12-15" },
    { name: "Standing Smith Calf Raises", muscles: "calves", repRange: "15-20" },
    { name: "Knee Bent Dragonflies", muscles: "abs", repRange: "15" },
    { name: "Cable Rope Crunches", muscles: "abs", repRange: "10-15" },
    { name: "Cable Wood Choppers", muscles: "obliques", repRange: "12-15" },
    { name: "Cable Serratus Punch", muscles: "serratus", repRange: "10-15" },
  ]},
  { id: "active_rest", label: "Active Rest", day: "Sunday", color: "#888780", exercises: [
    { name: "Incline Walk (20 min)", muscles: "cardio", repRange: "20 min" },
    { name: "Palof Press", muscles: "core", repRange: "10-15" },
    { name: "Side Plank", muscles: "core", repRange: "30sec" },
    { name: "Ab Roller", muscles: "abs", repRange: "8-12" },
    { name: "Captain's Chair Leg Raise", muscles: "abs", repRange: "8-12" },
    { name: "Cable Wood Choppers", muscles: "obliques", repRange: "12-15" },
    { name: "Light Bench", muscles: "chest", repRange: "8-12" },
    { name: "Pull-Ups", muscles: "back, biceps", repRange: "AMRAP" },
  ]},
];

export const MUSCLE_GROUPS = [
  "chest","back","shoulders","biceps","triceps","quads","glutes","hamstrings",
  "calves","abs","obliques","core","serratus","traps","forearms","rear delts","adductors",
];

const MAJOR = new Set([
  "chest","back","shoulders","biceps","triceps","quads","glutes","hamstrings",
]);

export const DEFAULT_RANGES = Object.fromEntries(
  MUSCLE_GROUPS.map((m) => [m, MAJOR.has(m) ? { min: 10, max: 20 } : { min: 6, max: 12 }])
);

export const HEATMAP_MUSCLES = [
  "chest","back","shoulders","biceps","triceps","quads","hamstrings",
  "glutes","calves","abs","core","rear_delts",
];

export const COMPOUNDS = [
  { name: "Flat Bench Press", color: "#1D9E75" },
  { name: "Barbell Back Squat", color: "#378ADD" },
  { name: "Smith RDL", color: "#D4537E" },
  { name: "Incline Smith Bench", color: "#BA7517" },
  { name: "DB Shoulder Press", color: "#7F77DD" },
];

export const cloneDeep = (o) => JSON.parse(JSON.stringify(o));
export const makeSet = () => ({ weight: "", reps: "" });
export const makeSets = (n = 3) => Array.from({ length: n }, makeSet);

export function migrateSplit(saved) {
  const hasLegsAbs = saved.some((d) => d.id === "legs_abs");
  if (!hasLegsAbs) {
    const arIdx = saved.findIndex((d) => d.id === "active_rest");
    const legsDay = cloneDeep(DEFAULT_SPLIT.find((d) => d.id === "legs_abs"));
    if (arIdx !== -1) {
      saved.splice(arIdx, 0, legsDay);
      saved[arIdx + 1].day = "Sunday";
    } else {
      saved.push(legsDay);
    }
  }
  saved.forEach((d) => {
    const def = DEFAULT_SPLIT.find((dd) => dd.id === d.id);
    if (def && !d.color) d.color = def.color;
    d.exercises.forEach((ex) => {
      if (!ex.repRange) {
        const defEx = def && def.exercises.find((e) => e.name === ex.name);
        ex.repRange = defEx ? defEx.repRange || "" : "";
      }
    });
  });
  return saved;
}
