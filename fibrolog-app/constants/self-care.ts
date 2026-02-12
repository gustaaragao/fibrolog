export interface SelfCareTip {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
}

export const SELF_CARE_TIPS: SelfCareTip[] = [
  {
    id: "1",
    titulo: "Alongamento Leve",
    descricao: "Dedique 10 minutos para alongamentos suaves. Isso ajuda a reduzir a rigidez muscular.",
    icone: "🧘",
  },
  {
    id: "2",
    titulo: "Hidratação",
    descricao: "Beba pelo menos 2 litros de água hoje. A hidratação é essencial para o bom funcionamento do corpo.",
    icone: "💧",
  },
  {
    id: "3",
    titulo: "Mindfulness",
    descricao: "Pratique 5 minutos de respiração consciente para acalmar o sistema nervoso e reduzir o estresse.",
    icone: "🧠",
  },
  {
    id: "4",
    titulo: "Higiene do Sono",
    descricao: "Evite telas 1 hora antes de dormir para melhorar a qualidade do seu descanso noturno.",
    icone: "🌙",
  },
];
