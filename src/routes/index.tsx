import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  Briefcase, FileText, Sparkles, CheckCircle2, AlertCircle, Lightbulb, Download, ShieldCheck,
  Loader2, Wand2, Pencil, RotateCcw, Check, Info, Target, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { analyze, generateCV, type Analysis, type OptimizedCV } from "@/lib/analyzer";

const DESC = "Adapte o seu currículo à vaga certa: compare o seu perfil com uma oportunidade e gere um currículo otimizado para sistemas ATS.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerMatch AI — ATS Resume Optimizer" },
      { name: "description", content: DESC },
      { property: "og:title", content: "CareerMatch AI — ATS Resume Optimizer" },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SAMPLE_JOB = `Analista de Dados Júnior — Lisboa (Híbrido)

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
• Excelente comunicação e espírito de equipa
• Inglês fluente`;

const SAMPLE_CV = `Ana Martins
ana.martins@email.pt | +351 912 345 678 | Lisboa

Licenciada em Gestão pela Universidade de Lisboa, com interesse em análise de dados.

Experiência profissional:
Assistente Administrativa — Empresa Exemplo, Lda. (2022–2024)
- organização de dados de vendas em Excel
- preparação de relatórios mensais para a direção
- apoio à gestão de fornecedores

Formação académica:
Licenciatura em Gestão — Universidade de Lisboa (2018–2021)

Competências: Excel, análise de dados, comunicação, trabalho em equipa
Idiomas: Português (nativo), Inglês (C1)`;

function Index() {
  const [job, setJob] = useState("");
  const [cv, setCv] = useState("");
  const [errors, setErrors] = useState<{ job?: boolean; cv?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Analysis | null>(null);
  const [generating, setGenerating] = useState(false);
  const [optimized, setOptimized] = useState<OptimizedCV | null>(null);
  const [editing, setEditing] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const cvRef = useRef<HTMLElement>(null);

  const scrollTo = (r: React.RefObject<HTMLElement | null>) =>
    setTimeout(() => r.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);

  const loadSample = () => {
    setJob(SAMPLE_JOB);
    setCv(SAMPLE_CV);
    setErrors({});
    toast.success("Exemplo de demonstração carregado");
  };

  const runAnalysis = () => {
    const e = { job: !job.trim(), cv: !cv.trim() };
    setErrors(e);
    if (e.job || e.cv) {
      toast.error("Preencha a descrição da vaga e o currículo antes de analisar.");
      return;
    }
    setLoading(true);
    setOptimized(null);
    setEditing(false);
    setTimeout(() => {
      setResult(analyze(job, cv));
      setLoading(false);
      toast.success("Análise concluída");
      scrollTo(resultsRef);
    }, 900);
  };

  const runGenerate = () => {
    if (!result) return;
    setGenerating(true);
    setTimeout(() => {
      setOptimized(generateCV(cv, job, result));
      setGenerating(false);
      toast.success("Currículo otimizado gerado");
      scrollTo(cvRef);
    }, 700);
  };

  const reset = () => {
    setJob(""); setCv(""); setResult(null); setOptimized(null); setEditing(false); setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Pronto para uma nova análise");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <a href="#analisar" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Target className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-extrabold">CareerMatch <span className="text-sky-strong">AI</span></span>
              <span className="hidden text-xs text-muted-foreground sm:block">O seu talento merece chegar ao recrutador.</span>
            </span>
          </a>
          <nav className="flex gap-1 text-sm font-medium">
            {[["#analisar", "Analisar CV"], ["#resultados", "Resultados"], ["#curriculo", "Currículo otimizado"]].map(([h, l]) => (
              <a key={h} href={h} className="rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-sky-soft hover:text-foreground">
                {l}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-hero">
          <div className="mx-auto max-w-4xl px-4 pb-10 pt-14 text-center sm:pt-20">
            <Badge className="rounded-full bg-sunny px-3 py-1 text-sunny-foreground hover:bg-sunny">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> ATS Resume Optimizer
            </Badge>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Transforme o seu currículo na <span className="text-sky-strong">candidatura certa.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-balance">
              Compare o seu perfil com uma oportunidade, descubra o que falta e prepare um currículo otimizado para sistemas ATS.
            </p>
          </div>
        </section>

        {/* Inputs */}
        <section id="analisar" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-6">
          <div className="grid gap-6 md:grid-cols-2">
            <InputCard
              icon={<Briefcase className="h-5 w-5" />}
              title="Descrição da vaga"
              value={job}
              error={errors.job}
              onChange={(v) => { setJob(v); if (v.trim()) setErrors((e) => ({ ...e, job: false })); }}
              placeholder="Cole aqui a descrição da vaga, incluindo requisitos, responsabilidades e competências..."
            />
            <InputCard
              icon={<FileText className="h-5 w-5" />}
              title="O meu currículo"
              value={cv}
              error={errors.cv}
              onChange={(v) => { setCv(v); if (v.trim()) setErrors((e) => ({ ...e, cv: false })); }}
              placeholder="Cole aqui o seu currículo, incluindo experiência profissional, formação e competências..."
            />
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={runAnalysis} disabled={loading} className="h-12 w-full rounded-full px-8 text-base font-semibold shadow-soft sm:w-auto">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {loading ? "A analisar…" : "Analisar compatibilidade"}
            </Button>
            <Button size="lg" variant="outline" onClick={loadSample} className="h-12 w-full rounded-full bg-card px-6 sm:w-auto">
              <ClipboardList className="h-5 w-5" /> Carregar exemplo de demonstração
            </Button>
          </div>
        </section>

        {/* Results */}
        <section id="resultados" ref={resultsRef} className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-12">
          <SectionTitle n="2" title="Resultados" />
          {!result ? (
            <Empty icon={<Target className="h-6 w-6" />} text="Os resultados aparecem aqui depois de analisar a compatibilidade." />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-0 shadow-soft">
                <CardContent className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[240px_1fr]">
                  <div className="flex flex-col items-center text-center">
                    <Gauge value={result.score} />
                    <p className="mt-3 text-lg font-bold">{result.label}</p>
                    <div className="mt-4 w-full space-y-2 text-left text-xs text-muted-foreground">
                      <Bar label="Competências (70%)" v={result.breakdown.skills} />
                      <Bar label="Experiência (20%)" v={result.breakdown.experience} />
                      <Bar label="Formação (10%)" v={result.breakdown.education} />
                    </div>
                  </div>
                  <div className="grid content-start gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-success" /> Palavras-chave encontradas</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.found.length ? result.found.map((k) => (
                          <Badge key={k} className="rounded-full bg-sky-soft px-3 py-1 text-foreground hover:bg-sky-soft"><Check className="mr-1 h-3 w-3" />{k}</Badge>
                        )) : <p className="text-sm text-muted-foreground">Nenhuma correspondência encontrada.</p>}
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold"><AlertCircle className="h-5 w-5 text-sunny-foreground" /> Palavras-chave em falta</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.missing.length ? result.missing.map((k) => (
                          <Badge key={k} className="rounded-full bg-sunny px-3 py-1 text-sunny-foreground hover:bg-sunny">{k}</Badge>
                        )) : <p className="text-sm text-muted-foreground">Não faltam palavras-chave relevantes. 🎉</p>}
                      </div>
                    </div>
                    <div className="rounded-xl bg-sunny/70 p-5 sm:col-span-2">
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-sunny-foreground"><Lightbulb className="h-5 w-5" /> Recomendações</h3>
                      <ol className="space-y-2 text-sm">
                        {result.recommendations.map((t, i) => (
                          <li key={t} className="flex gap-3">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-card text-xs font-bold">{i + 1}</span>{t}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <p className="flex gap-2 text-xs text-muted-foreground sm:col-span-2">
                      <Info className="h-4 w-4 shrink-0" />
                      A pontuação é uma estimativa indicativa e não garante a aprovação no sistema ATS de um empregador.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6 flex justify-center">
                <Button size="lg" onClick={runGenerate} disabled={generating} className="h-12 rounded-full px-8 text-base font-semibold shadow-soft">
                  {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5" />}
                  {generating ? "A gerar…" : "Gerar currículo otimizado"}
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Optimized CV */}
        <section id="curriculo" ref={cvRef} className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-14">
          <SectionTitle n="3" title="Currículo otimizado" />
          {!optimized ? (
            <Empty icon={<FileText className="h-6 w-6" />} text="Depois da análise, gere aqui um currículo otimizado para ATS." />
          ) : (
            <Card className="border-0 shadow-soft animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CardHeader className="flex-row flex-wrap items-center justify-between gap-4 space-y-0">
                <div>
                  <CardTitle className="text-xl">O seu currículo otimizado para ATS</CardTitle>
                  <CardDescription>Formato de coluna única, sem tabelas nem gráficos.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant={editing ? "default" : "outline"} className="rounded-full" onClick={() => { setEditing(!editing); if (editing) toast.success("Alterações guardadas"); }}>
                    {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    {editing ? "Concluir edição" : "Editar currículo"}
                  </Button>
                  <Button className="rounded-full" onClick={() => { setEditing(false); setTimeout(() => window.print(), 50); }}>
                    <Download className="h-4 w-4" /> Descarregar PDF
                  </Button>
                  <Button variant="ghost" className="rounded-full" onClick={reset}>
                    <RotateCcw className="h-4 w-4" /> Nova análise
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editing && (
                  <p className="mb-3 rounded-lg bg-sky-soft px-3 py-2 text-sm">Clique em qualquer texto do currículo para o editar.</p>
                )}
                <CvDocument cv={optimized} editing={editing} />
              </CardContent>
            </Card>
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-14">
        <div className="mx-auto flex max-w-3xl items-start gap3 gap-3 rounded-2xl border bg-card p-5 text-sm text-muted-foreground">
          <ShieldCheck className="h-5 w-5 shrink-0 text-sky-strong" />
          <p>A CareerMatch AI ajuda a melhorar a apresentação das suas qualificações, mas nunca inventa experiências, competências ou certificações. Reveja sempre o currículo antes de o enviar.</p>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{n}</span>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
}

function Empty({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed bg-card/60 px-6 py-12 text-center text-muted-foreground">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-soft text-sky-strong">{icon}</span>
      <p className="max-w-sm text-sm">{text}</p>
    </div>
  );
}

function InputCard({ icon, title, value, onChange, placeholder, error }: {
  icon: React.ReactNode; title: string; value: string; onChange: (v: string) => void; placeholder: string; error?: boolean;
}) {
  return (
    <Card className="border-0 shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-soft text-sky-strong">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={error}
          aria-label={title}
          className="min-h-[300px] resize-y bg-background text-sm leading-relaxed"
        />
        <div className="mt-2 flex justify-between text-xs">
          <span className={error ? "text-destructive" : "text-transparent"}>Este campo é obrigatório.</span>
          <span className="text-muted-foreground">{value.trim() ? value.trim().split(/\s+/).length : 0} palavras</span>
        </div>
      </CardContent>
    </Card>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between"><span>{label}</span><span>{Math.round(v * 100)}%</span></div>
      <div className="h-1.5 rounded-full bg-sky-soft"><div className="h-full rounded-full bg-primary" style={{ width: `${v * 100}%` }} /></div>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const r = 70, c = 2 * Math.PI * r;
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={r} strokeWidth="14" fill="none" className="stroke-sky-soft" />
        <circle cx="80" cy="80" r={r} strokeWidth="14" fill="none" strokeLinecap="round" className="stroke-primary transition-all duration-1000"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold">{value}%</span>
        <span className="text-xs text-muted-foreground">compatibilidade</span>
      </span>
    </div>
  );
}

function CvDocument({ cv, editing }: { cv: OptimizedCV; editing: boolean }) {
  const e = { contentEditable: editing, suppressContentEditableWarning: true };
  const ed = editing ? "rounded outline-none ring-sky focus:ring-2 hover:bg-sky-soft/50" : "";
  return (
    <article id="cv-print" className="mx-auto max-w-3xl rounded-lg border bg-card p-8 text-navy sm:p-12">
      <header className="border-b-2 border-primary pb-4">
        <h2 {...e} className={`text-2xl font-bold ${ed}`}>{cv.name || "Nome"}</h2>
        {cv.contact && <p {...e} className={`mt-1 text-sm text-muted-foreground ${ed}`}>{cv.contact}</p>}
      </header>
      {cv.profile && <CvSection title="Perfil profissional"><p {...e} className={ed}>{cv.profile}</p></CvSection>}
      {cv.skills.length > 0 && <CvSection title="Competências"><p {...e} className={ed}>{cv.skills.join(" · ")}</p></CvSection>}
      {cv.experience.length > 0 && (
        <CvSection title="Experiência profissional">
          <div className="space-y-3">
            {cv.experience.map((x, i) => (
              <div key={i}>
                <p {...e} className={`font-semibold ${ed}`}>{x.title}</p>
                {x.items.length > 0 && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {x.items.map((it, j) => <li key={j} {...e} className={ed}>{it}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </CvSection>
      )}
      {cv.education.length > 0 && (
        <CvSection title="Formação académica">
          {cv.education.map((x, i) => <p key={i} {...e} className={ed}>{x}</p>)}
        </CvSection>
      )}
      {cv.certifications.length > 0 && (
        <CvSection title="Certificações">
          {cv.certifications.map((x, i) => <p key={i} {...e} className={ed}>{x}</p>)}
        </CvSection>
      )}
      {cv.languages.length > 0 && <CvSection title="Idiomas"><p {...e} className={ed}>{cv.languages.join(" · ")}</p></CvSection>}
    </article>
  );
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5 break-inside-avoid">
      <h3 className="mb-1.5 text-xs font-bold uppercase tracking-widest text-sky-strong">{title}</h3>
      <div className="text-sm leading-relaxed">{children}</div>
    </section>
  );
}
