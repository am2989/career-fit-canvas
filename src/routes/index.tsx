import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Briefcase, FileText, Sparkles, CheckCircle2, XCircle, Lightbulb, Download, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerMatch AI — Compatibilidade entre currículo e vaga" },
      { name: "description", content: "Adapte o seu currículo à vaga certa e destaque-se nos processos de recrutamento." },
      { property: "og:title", content: "CareerMatch AI" },
      { property: "og:description", content: "Adapte o seu currículo à vaga certa e destaque-se nos processos de recrutamento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const VAGA = `Analista de Dados Júnior — Lisboa (Híbrido)

Procuramos um(a) Analista de Dados para integrar a nossa equipa de Business Intelligence.

Responsabilidades:
• Recolher, tratar e analisar dados de negócio
• Criar relatórios e dashboards em Power BI
• Escrever consultas SQL
• Apoiar a gestão na tomada de decisão

Requisitos:
• Licenciatura em Gestão, Economia ou área afim
• Domínio de Excel avançado
• Conhecimentos de SQL e Power BI
• Excelente comunicação e espírito de equipa`;

const CV = `Ana Martins
ana.martins@email.pt | Lisboa

Licenciada em Gestão pela Universidade de Lisboa.

Experiência:
Assistente Administrativa — Empresa Exemplo, Lda. (2022–2024)
- Organização de dados de vendas em Excel
- Preparação de relatórios mensais
- Apoio à gestão de fornecedores

Competências: Excel, análise de dados, comunicação, trabalho em equipa.
Idiomas: Português (nativo), Inglês (C1).`;

const found = ["Excel", "Análise de dados", "Gestão", "Comunicação"];
const missing = ["Power BI", "SQL"];
const tips = [
  "Quantifique resultados (ex.: “relatórios mensais para 5 departamentos”).",
  "Se tiver formação em Power BI ou SQL, mencione-a de forma explícita.",
  "Adicione um perfil profissional curto, alinhado com a função de Analista de Dados.",
  "Use os mesmos termos da vaga, como “tratamento de dados” e “apoio à decisão”.",
];

function Index() {
  const [vaga, setVaga] = useState(VAGA);
  const [cv, setCv] = useState(CV);
  const [show, setShow] = useState(false);
  const resRef = useRef<HTMLDivElement>(null);

  const analyse = () => {
    setShow(true);
    setTimeout(() => resRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div className="min-h-screen bg-hero">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-sunny px-4 py-1.5 text-sm font-medium text-sunny-foreground">
            <Sparkles className="h-4 w-4" /> Protótipo de demonstração
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl">
            CareerMatch <span className="text-primary">AI</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Adapte o seu currículo à vaga certa e destaque-se nos processos de recrutamento.
          </p>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <InputCard icon={<Briefcase className="h-5 w-5" />} title="1. Descrição da vaga" value={vaga} onChange={setVaga} placeholder="Cole aqui a descrição da oportunidade…" />
          <InputCard icon={<FileText className="h-5 w-5" />} title="2. O meu currículo" value={cv} onChange={setCv} placeholder="Cole aqui o seu currículo atual…" />
        </section>

        <div className="mt-8 flex justify-center">
          <Button size="lg" onClick={analyse} className="h-12 rounded-full px-8 text-base shadow-soft">
            <Sparkles className="mr-1 h-5 w-5" /> Analisar compatibilidade
          </Button>
        </div>

        {show && (
          <div ref={resRef} className="mt-14 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-0 shadow-soft">
              <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[220px_1fr]">
                <div className="flex flex-col items-center justify-center">
                  <Gauge value={85} />
                  <p className="mt-3 font-semibold">Compatibilidade</p>
                  <p className="text-sm text-muted-foreground">Boa correspondência</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-success" /> Palavras-chave encontradas</h3>
                    <div className="flex flex-wrap gap-2">
                      {found.map((k) => <Badge key={k} className="rounded-full bg-sky-soft px-3 py-1 text-accent-foreground hover:bg-sky-soft">{k}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-semibold"><XCircle className="h-5 w-5 text-destructive" /> Palavras-chave em falta</h3>
                    <div className="flex flex-wrap gap-2">
                      {missing.map((k) => <Badge key={k} variant="secondary" className="rounded-full px-3 py-1">{k}</Badge>)}
                    </div>
                  </div>
                  <div className="sm:col-span-2 rounded-xl bg-sunny p-5">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-sunny-foreground"><Lightbulb className="h-5 w-5" /> Sugestões de melhoria</h3>
                    <ul className="space-y-2 text-sm">
                      {tips.map((t) => <li key={t} className="flex gap-2"><span className="text-sunny-foreground">•</span>{t}</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader className="flex-row flex-wrap items-center justify-between gap-4 space-y-0">
                <CardTitle className="text-xl">O seu currículo otimizado para ATS</CardTitle>
                <Button onClick={() => window.print()} className="rounded-full">
                  <Download className="mr-1 h-4 w-4" /> Descarregar currículo PDF
                </Button>
              </CardHeader>
              <CardContent>
                <article id="cv-print" className="mx-auto max-w-3xl rounded-lg border bg-card p-8 sm:p-10">
                  <div className="border-b-2 border-sky pb-4">
                    <h2 className="text-2xl font-bold">Ana Martins</h2>
                    <p className="text-sm text-muted-foreground">Analista de Dados · Lisboa · ana.martins@email.pt</p>
                  </div>
                  <CvSection title="Perfil profissional">
                    Licenciada em Gestão com experiência na organização e análise de dados de vendas em Excel e na preparação de relatórios de apoio à gestão. Comunicativa, orientada para o detalhe e motivada para evoluir na área de Business Intelligence.
                  </CvSection>
                  <CvSection title="Competências">
                    Excel avançado · Análise e tratamento de dados · Relatórios de gestão · Comunicação · Trabalho em equipa
                  </CvSection>
                  <CvSection title="Experiência profissional">
                    <p className="font-semibold">Assistente Administrativa — Empresa Exemplo, Lda.</p>
                    <p className="text-xs text-muted-foreground">2022 – 2024</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      <li>Organização e análise de dados de vendas em Excel.</li>
                      <li>Preparação de relatórios mensais de apoio à decisão da gestão.</li>
                      <li>Apoio à gestão de fornecedores e processos administrativos.</li>
                    </ul>
                  </CvSection>
                  <CvSection title="Formação académica">
                    <p className="font-semibold">Licenciatura em Gestão</p>
                    <p className="text-xs text-muted-foreground">Universidade de Lisboa</p>
                  </CvSection>
                  <CvSection title="Idiomas">Português (nativo) · Inglês (C1)</CvSection>
                </article>
              </CardContent>
            </Card>
          </div>
        )}

        <footer className="mx-auto mt-16 flex max-w-3xl items-start gap-3 rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
          <p>A CareerMatch AI melhora a apresentação das suas qualificações, mas nunca inventa experiências, competências ou certificações.</p>
        </footer>
      </main>
    </div>
  );
}

function InputCard({ icon, title, value, onChange, placeholder }: { icon: React.ReactNode; title: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <Card className="border-0 shadow-soft">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-soft text-primary">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-h-[320px] resize-y bg-muted/40 text-sm leading-relaxed" />
      </CardContent>
    </Card>
  );
}

function Gauge({ value }: { value: number }) {
  const r = 70, c = 2 * Math.PI * r;
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={r} strokeWidth="14" fill="none" className="stroke-sunny" />
        <circle cx="80" cy="80" r={r} strokeWidth="14" fill="none" strokeLinecap="round" className="stroke-sky" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold">{value}%</span>
    </div>
  );
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{title}</h3>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}
