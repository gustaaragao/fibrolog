import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface Symptom {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const SYMPTOMS: Symptom[] = [
  { id: "1", name: "Dor de Cabeça", icon: "head-alert" },
  { id: "2", name: "Dor nas Costas", icon: "human-handsdown" },
  { id: "3", name: "Cansaço", icon: "battery-alert" },
  { id: "4", name: "Insônia", icon: "sleep" },
  { id: "5", name: "Rigidez", icon: "run" },
  { id: "6", name: "Névoa Mental", icon: "brain" },
  { id: "7", name: "Ansiedade", icon: "emoticon-confused" },
  { id: "8", name: "Depressão", icon: "emoticon-sad" },
];

export const SYMPTOMS_MAP = SYMPTOMS.reduce((acc, symptom) => {
  acc[symptom.id] = symptom;
  return acc;
}, {} as Record<string, Symptom>);
