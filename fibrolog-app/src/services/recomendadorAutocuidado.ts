export type Sintoma =
  | 'dor_muscular'
  | 'fadiga'
  | 'insonia'
  | 'ansiedade';

export type Sugestao = {
  id: number;
  titulo: string;
  descricao: string;
  motivo: string;
  sintomasRelacionados: Sintoma[];
};

const sugestoes: Sugestao[] = [
  {
    id: 1,
    titulo: 'Alongamento Leve',
    descricao:
      'Realize alongamentos suaves por 5 a 10 minutos para aliviar a rigidez muscular.',
    motivo: 'Sugerido devido a relatos frequentes de dor muscular.',
    sintomasRelacionados: ['dor_muscular'],
  },
  {
    id: 2,
    titulo: 'Respiração Guiada',
    descricao:
      'Pratique respiração profunda para ajudar no controle do estresse e ansiedade.',
    motivo: 'Sugerido com base em níveis elevados de estresse registrados.',
    sintomasRelacionados: ['ansiedade'],
  },
  {
    id: 3,
    titulo: 'Hidratação Regular',
    descricao:
      'Manter-se hidratado pode ajudar a reduzir fadiga e melhorar o bem-estar.',
    motivo: 'Sugerido devido a episódios frequentes de fadiga.',
    sintomasRelacionados: ['fadiga'],
  },
  {
    id: 4,
    titulo: 'Higiene do Sono',
    descricao:
      'Evite telas antes de dormir e mantenha horários regulares de sono.',
    motivo: 'Auxilia em problemas de sono.',
    sintomasRelacionados: ['insonia'],
  },
];

export function recomendarAutocuidado(
  sintomasUsuario: Sintoma[]
): Sugestao[] {
  return sugestoes.filter((sugestao) =>
    sugestao.sintomasRelacionados.some((s) =>
      sintomasUsuario.includes(s)
    )
  );
}
