// Lightweight, local CV ↔ job analysis. No external services.

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9+#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Known skills / professional terms (display label → aliases, normalized).
const SKILLS: Record<string, string[]> = {
  Excel: ["excel"],
  "Power BI": ["power bi", "powerbi"],
  SQL: ["sql"],
  Python: ["python"],
  R: [" r "],
  Tableau: ["tableau"],
  "Análise de dados": ["analise de dados", "analisar dados", "analise dados", "data analysis"],
  "Tratamento de dados": ["tratamento de dados", "tratar dados", "limpeza de dados"],
  "Business Intelligence": ["business intelligence", " bi "],
  Dashboards: ["dashboard", "dashboards"],
  Relatórios: ["relatorio", "relatorios", "reporting"],
  Gestão: ["gestao"],
  "Gestão de projetos": ["gestao de projetos", "gestao de projeto"],
  Comunicação: ["comunicacao", "comunicativa", "comunicativo"],
  "Trabalho em equipa": ["trabalho em equipa", "espirito de equipa", "teamwork"],
  Liderança: ["lideranca", "liderar"],
  Organização: ["organizacao", "organizado", "organizada"],
  "Resolução de problemas": ["resolucao de problemas"],
  "Apoio à decisão": ["tomada de decisao", "apoio a decisao", "apoiar a decisao"],
  Vendas: ["vendas"],
  Marketing: ["marketing"],
  "Marketing digital": ["marketing digital"],
  SEO: ["seo"],
  Contabilidade: ["contabilidade"],
  Finanças: ["financas", "financeira", "financeiro"],
  "Recursos humanos": ["recursos humanos"],
  "Atendimento ao cliente": ["atendimento ao cliente", "apoio ao cliente"],
  JavaScript: ["javascript"],
  TypeScript: ["typescript"],
  React: ["react"],
  "Node.js": ["node js", "nodejs"],
  Java: ["java"],
  Git: ["git"],
  Scrum: ["scrum"],
  Agile: ["agile", "metodologias ageis"],
  SAP: ["sap"],
  CRM: ["crm"],
  "Microsoft Office": ["microsoft office", "office"],
  Inglês: ["ingles", "english"],
  Francês: ["frances"],
  Espanhol: ["espanhol"],
};

const EDUCATION = [
  "licenciatura", "licenciado", "licenciada", "mestrado", "doutoramento", "pos graduacao",
  "bacharelato", "12 ano", "curso profissional", "gestao", "economia", "engenharia",
  "informatica", "estatistica", "matematica", "marketing", "contabilidade", "direito",
];

const STOP = new Set(
  "a o as os e de da do das dos em no na nos nas um uma uns umas para por com sem que se ao aos ou mais muito como sua seu suas seus nossa nosso nossas nossos ser ter sobre entre ate desde tambem pelo pela pelos pelas este esta estes estas isso isto procuramos requisitos responsabilidades equipa area empresa funcao lisboa porto hibrido remoto anos ano experiencia conhecimentos dominio excelente bom boa forte capacidade".split(
    " ",
  ),
);

const has = (text: string, alias: string) => ` ${text} `.includes(alias.startsWith(" ") ? alias : ` ${alias} `);

export const findSkills = (text: string) => {
  const n = normalize(text);
  return Object.entries(SKILLS)
    .filter(([, aliases]) => aliases.some((a) => has(n, a)))
    .map(([label]) => label);
};

const contentTokens = (text: string) =>
  new Set(normalize(text).split(" ").filter((w) => w.length > 3 && !STOP.has(w)));

export type Analysis = {
  score: number;
  label: string;
  found: string[];
  missing: string[];
  recommendations: string[];
  breakdown: { skills: number; experience: number; education: number };
};

export const scoreLabel = (score: number) =>
  score >= 80
    ? "Excelente compatibilidade"
    : score >= 60
      ? "Boa compatibilidade"
      : score >= 40
        ? "Compatibilidade moderada"
        : "Compatibilidade reduzida";

export const computeScore = (skills: number, experience: number, education: number) =>
  Math.round(100 * (0.7 * skills + 0.2 * experience + 0.1 * education));

export function analyze(job: string, cv: string): Analysis {
  const jobSkills = findSkills(job);
  const cvSkills = new Set(findSkills(cv));
  const found = jobSkills.filter((s) => cvSkills.has(s));
  const missing = jobSkills.filter((s) => !cvSkills.has(s));

  // Skills (70%)
  const jobTokens = contentTokens(job);
  const cvTokens = contentTokens(cv);
  const skills = jobSkills.length
    ? found.length / jobSkills.length
    : [...jobTokens].filter((t) => cvTokens.has(t)).length / Math.max(jobTokens.size, 1);

  // Experience & responsibilities (20%): overlap of job vocabulary, scaled
  const overlap = [...jobTokens].filter((t) => cvTokens.has(t)).length;
  const experience = Math.min(1, (overlap / Math.max(jobTokens.size, 1)) * 2.5);

  // Education (10%)
  const nj = ` ${normalize(job)} `;
  const nc = ` ${normalize(cv)} `;
  const eduReq = EDUCATION.filter((e) => nj.includes(` ${e} `));
  const education = eduReq.length
    ? eduReq.filter((e) => nc.includes(` ${e} `)).length > 0
      ? 1
      : 0
    : 1;

  const score = computeScore(skills, experience, education);

  const recommendations: string[] = [];
  if (missing.length)
    recommendations.push(
      `Se tiver experiência ou formação em ${missing.slice(0, 3).join(", ")}, refira-a de forma explícita. Caso contrário, considere desenvolver estas competências.`,
    );
  if (!/\d/.test(cv.replace(/\b(19|20)\d{2}\b/g, "")))
    recommendations.push("Quantifique resultados (ex.: número de relatórios, clientes, percentagens de melhoria).");
  recommendations.push(
    found.length
      ? `Destaque no perfil profissional as competências mais pedidas: ${found.slice(0, 3).join(", ")}.`
      : "Use os mesmos termos da vaga quando descrevem com verdade a sua experiência.",
  );
  if (education === 0) recommendations.push("Indique claramente a sua formação académica e a área de estudo.");
  recommendations.push("Organize o currículo em secções padrão e utilize verbos de ação no início de cada tarefa.");

  return {
    score,
    label: scoreLabel(score),
    found,
    missing,
    recommendations: recommendations.slice(0, 3),
    breakdown: { skills, experience, education },
  };
}

// ---------- Optimized CV ----------

export type OptimizedCV = {
  name: string;
  contact: string;
  profile: string;
  skills: string[];
  experience: { title: string; items: string[] }[];
  education: string[];
  certifications: string[];
  languages: string[];
};

const SECTION_RX: [keyof OptimizedCV | "summary", RegExp][] = [
  ["experience", /^(experiencia|experiencia profissional|historico profissional)/],
  ["education", /^(formacao|formacao academica|educacao|habilitacoes)/],
  ["skills", /^(competencias|skills|aptidoes)/],
  ["languages", /^(idiomas|linguas)/],
  ["certifications", /^(certificacoes|certificados|cursos)/],
  ["summary", /^(perfil|resumo|sobre mim)/],
];

const VERBS: [RegExp, string][] = [
  [/^fiz /i, "Realização de "],
  [/^ajudei (a|na|no)? ?/i, "Apoio "],
  [/^trabalhei com /i, "Utilização de "],
  [/^tratava d[aeo]s? /i, "Gestão de "],
];

const polish = (line: string) => {
  let s = line.replace(/^[-•*·\s]+/, "").trim();
  for (const [rx, rep] of VERBS) s = s.replace(rx, rep);
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return /[.!?]$/.test(s) ? s : `${s}.`;
};

const splitList = (s: string) =>
  s.split(/[,;|·]/).map((x) => x.replace(/^[-•*\s]+/, "").replace(/\.$/, "").trim()).filter(Boolean);

export function generateCV(cv: string, job: string, analysis: Analysis): OptimizedCV {
  const lines = cv.split("\n").map((l) => l.trim()).filter(Boolean);
  const out: OptimizedCV = {
    name: lines[0] ?? "",
    contact: "",
    profile: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
  };
  const summary: string[] = [];
  let section: string = "summary";

  for (const raw of lines.slice(1)) {
    const n = normalize(raw);
    if (!out.contact && (/@/.test(raw) || /\+?\d[\d\s]{8,}/.test(raw))) {
      out.contact = raw;
      continue;
    }
    const hit = SECTION_RX.find(([, rx]) => rx.test(n));
    let rest = raw;
    if (hit) {
      section = hit[0];
      const idx = raw.indexOf(":");
      rest = idx >= 0 ? raw.slice(idx + 1).trim() : "";
      if (!rest) continue;
    }
    switch (section) {
      case "skills":
        out.skills.push(...splitList(rest));
        break;
      case "languages":
        out.languages.push(...splitList(rest));
        break;
      case "certifications":
        out.certifications.push(rest.replace(/^[-•*\s]+/, ""));
        break;
      case "education":
        out.education.push(rest.replace(/^[-•*\s]+/, ""));
        break;
      case "experience":
        if (/^[-•*]/.test(rest) && out.experience.length) out.experience.at(-1)!.items.push(polish(rest));
        else out.experience.push({ title: rest, items: [] });
        break;
      default:
        summary.push(rest);
    }
  }

  // Education mentioned inside the summary (e.g. "Licenciada em Gestão…")
  if (!out.education.length) {
    const edu = summary.find((s) => /licenciad|mestrado|licenciatura|curso/i.test(s));
    if (edu) out.education.push(edu.replace(/\.$/, ""));
  }

  // Skills: original list + recognised skills present in the CV, job-relevant first
  const cvSkills = findSkills(cv).filter((s) => !["Inglês", "Francês", "Espanhol"].includes(s));
  const all = [...analysis.found.filter((s) => cvSkills.includes(s)), ...cvSkills, ...out.skills];
  const seen = new Set<string>();
  out.skills = all.filter((s) => {
    const k = normalize(s);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  // Profile: rewritten only from facts present in the CV
  const jobTitle = job.split("\n").map((l) => l.trim()).find(Boolean)?.split(/[—–-]/)[0].trim();
  const base = summary.map(polish).join(" ");
  const highlights = analysis.found.slice(0, 4).join(", ");
  out.profile = [
    base,
    highlights ? `Competências relevantes: ${highlights}.` : "",
    jobTitle ? `Motivação para contribuir na função de ${jobTitle}.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return out;
}
