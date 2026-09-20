import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, CircleHelp, Edit3, Flame, GlassWater, Heart, Home as HomeIcon, Leaf, Plus, RotateCcw, Send, Sparkles, Star, Trash2, Wind, X } from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { AVOID_OPTIONS, brands, flavours, getFlavour, TASTE_OPTIONS, type Flavour, type Strength } from './data/flavours';
import { getRecommendations, type Recommendation } from './logic/recommendationEngine';
import { getWhatsAppUrl } from './logic/whatsapp';
import type { Choice, CustomLevel, FinderAnswers } from './types';

const STORAGE_KEY = 'hillview-hookah-current-choice';

const emptyAnswers: FinderAnswers = {
  tastes: [],
  strength: 'Medium',
  favouriteId: null,
  avoid: [],
  surprise: false,
};

function readChoice(): Choice | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Choice) : null;
  } catch {
    return null;
  }
}

function openWhatsApp(choice: Choice) {
  window.open(getWhatsAppUrl(choice), '_blank', 'noopener,noreferrer');
}

function FlavourVisual({ flavour, size = 'md' }: { flavour: Flavour; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-32 w-32' : size === 'sm' ? 'h-12 w-12' : 'h-20 w-20';
  return (
    <div
      className={`ingredient-orb ${sizeClass} shrink-0 rounded-[1.35rem] border border-white/40 shadow-inner`}
      style={{ '--orb-light': flavour.orb.light, '--orb-mid': flavour.orb.mid, '--orb-deep': flavour.orb.deep } as CSSProperties}
      role="img"
      aria-label={`${flavour.name} ingredient visual`}
      data-testid={`visual-flavour-${flavour.id}`}
    >
      <div className="flex h-full w-full items-end justify-end p-2">
        <span className="rounded-full bg-black/15 px-2 py-1 font-mono text-[9px] text-white/90">{flavour.name.split(' ').map((word) => word[0]).join('')}</span>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-3" data-testid="link-brand-home">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-secondary shadow-lg shadow-primary/15">
        <Flame size={19} strokeWidth={1.8} />
        <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-secondary" />
      </span>
      <span className="leading-none">
        <span className="block font-mono text-[10px] tracking-[0.18em] text-muted-foreground">HILLVIEW</span>
        <span className="hv-display block text-lg">Hookah Mixology</span>
      </span>
    </Link>
  );
}

function BottomNav({ choice }: { choice: Choice | null }) {
  const [location] = useLocation();
  const items = [
    { href: '/', label: 'Home', icon: HomeIcon },
    { href: '/find', label: 'Find My Hookah', icon: Sparkles },
    { href: '/choice', label: 'My Choice', icon: Heart, count: choice ? '1' : undefined },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/70 bg-background/90 px-3 pb-[max(.8rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:bottom-5 md:left-1/2 md:right-auto md:w-[480px] md:-translate-x-1/2 md:rounded-2xl md:border md:shadow-2xl md:shadow-primary/10" aria-label="Primary navigation">
      <div className="mx-auto grid max-w-lg grid-cols-3 gap-1">
        {items.map(({ href, label, icon: Icon, count }) => {
          const active = location === href || (href === '/find' && location.startsWith('/find'));
          return (
            <Link href={href} className={`relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-semibold transition-colors ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`} key={href}>
              <Icon size={17} strokeWidth={active ? 2.4 : 1.8} />
              <span>{label}</span>
              {count && <span className="absolute right-5 top-1 h-2 w-2 rounded-full bg-accent" aria-label="Saved choice" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AppShell({ children, choice }: { children: ReactNode; choice: Choice | null }) {
  return (
    <div className="hv-app hv-noise">
      <header className="hv-shell flex items-center justify-between py-5 md:py-7">
        <BrandMark />
        <div className="hidden items-center gap-2 text-right md:flex">
          <CircleHelp size={16} className="text-secondary" />
          <span className="text-xs text-muted-foreground">A little guidance for your next cloud</span>
        </div>
      </header>
      {children}
      <BottomNav choice={choice} />
    </div>
  );
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="hv-mono mb-4 text-[10px] font-medium text-accent">{children}</p>;
}

function HomePage({ onFind, onSurprise }: { onFind: () => void; onSurprise: () => void }) {
  const popular = ['Fresh', 'Fruity', 'Cooling', 'Exotic'];
  return (
    <main className="hv-shell hv-page-in">
      <section className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-12 text-primary-foreground shadow-2xl shadow-primary/20 md:px-14 md:py-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-secondary/20 bg-secondary/10 blur-sm" />
        <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <SectionEyebrow>HILLVIEW / TABLESIDE GUIDE 01</SectionEyebrow>
          <p className="mb-5 max-w-md text-sm leading-6 text-primary-foreground/65">A quiet way to find a flavour you will actually enjoy.</p>
          <h1 className="hv-display text-[3.4rem] leading-[.98] tracking-[-.055em] md:text-[5.6rem]">Find Your<br /><span className="text-secondary">Perfect Hookah.</span></h1>
          <p className="mt-7 max-w-md text-base leading-7 text-primary-foreground/75 md:text-lg">Tell us what you like. We’ll create the mix.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button className="hv-press flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-secondary px-6 font-bold text-secondary-foreground shadow-lg shadow-secondary/20" onClick={onFind} data-testid="button-find-my-hookah">
              FIND MY HOOKAH <ArrowRight size={18} />
            </button>
            <button className="hv-press flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-primary-foreground/20 px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10" onClick={onSurprise} data-testid="button-surprise-me">
              <Sparkles size={17} /> SURPRISE ME
            </button>
          </div>
        </div>
        <div className="relative mt-14 flex items-end justify-between border-t border-primary-foreground/15 pt-5 md:absolute md:bottom-8 md:right-12 md:mt-0 md:block md:border-0 md:pt-0">
          <div className="hidden text-right md:block">
            <p className="hv-mono text-[9px] text-primary-foreground/40">THE HILLVIEW NOTE</p>
            <p className="mt-2 max-w-[150px] text-sm leading-5 text-primary-foreground/70">No percentages. No wrong answers.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-primary-foreground/45 md:mt-16">
            <span className="h-2 w-2 rounded-full bg-secondary" /> Guided in under a minute
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <SectionEyebrow>START WITH A MOOD</SectionEyebrow>
            <h2 className="hv-display text-4xl md:text-5xl">What sounds good?</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">Tap a starting point, or let the expert take the first pour.</p>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
          {popular.map((taste, index) => (
            <button key={taste} className="hv-press hv-surface group flex min-h-28 flex-col justify-between rounded-2xl p-4 text-left hover:-translate-y-1 hover:border-secondary" onClick={onFind} data-testid={`button-popular-${taste.toLowerCase()}`}>
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${index % 2 ? 'bg-accent/12 text-accent' : 'bg-secondary/20 text-secondary-foreground'}`}>
                {index === 0 ? <Wind size={16} /> : index === 1 ? <Leaf size={16} /> : index === 2 ? <GlassWater size={16} /> : <Star size={16} />}
              </span>
              <span className="flex items-center justify-between text-sm font-semibold">{taste}<ChevronRight size={15} className="text-muted-foreground transition-transform group-hover:translate-x-1" /></span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 border-t border-border/70 py-10 md:grid-cols-[1.1fr_1fr] md:py-14">
        <div>
          <SectionEyebrow>THE EASY PART</SectionEyebrow>
          <h2 className="hv-display max-w-md text-3xl md:text-4xl">A good mix starts with a good question.</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 md:gap-5">
          {[
            ['01', 'Name your mood', 'A few familiar taste words are all we need.'],
            ['02', 'Meet your match', 'We’ll bring back three blends worth trying.'],
            ['03', 'Send it over', 'Your finished choice goes straight to Hillview.'],
          ].map(([number, title, copy]) => (
            <div className="border-l border-secondary/50 pl-4" key={number}>
              <span className="font-mono text-xs text-secondary">{number}</span>
              <h3 className="mt-7 text-sm font-bold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StepHeader({ step, total, onBack }: { step: number; total: number; onBack?: () => void }) {
  return (
    <div className="mb-8">
      <div className="mb-5 flex items-center justify-between">
        {onBack ? <button className="flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" onClick={onBack} data-testid="button-finder-back"><ArrowLeft size={17} /> Back</button> : <span />}
        <span className="hv-mono text-[10px] text-muted-foreground">STEP {step} / {total}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-secondary transition-all duration-500" style={{ width: `${(step / total) * 100}%` }} />
      </div>
    </div>
  );
}

function FinderPage({ onSave, editChoice, launch }: { onSave: (choice: Choice) => void; editChoice: Choice | null; launch: 'fresh' | 'surprise' | 'edit' }) {
  const [stage, setStage] = useState<'taste' | 'strength' | 'favourite' | 'results' | 'customize' | 'final'>('taste');
  const [answers, setAnswers] = useState<FinderAnswers>(emptyAnswers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customizations, setCustomizations] = useState<Record<string, CustomLevel>>({});
  const [remarks, setRemarks] = useState('');
  const [activeDetail, setActiveDetail] = useState<Flavour | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (launch === 'edit' && editChoice) {
      setAnswers({ tastes: editChoice.tastes, strength: editChoice.strength, favouriteId: editChoice.favouriteId, avoid: editChoice.avoid, surprise: false });
      setSelectedIds(editChoice.flavourIds);
      setCustomizations(editChoice.customizations);
      setRemarks(editChoice.remarks);
      setStage('customize');
    } else if (launch === 'surprise') {
      const surpriseAnswers = { ...emptyAnswers, surprise: true };
      setAnswers(surpriseAnswers);
      setStage('results');
      setSelectedIds([]);
      setCustomizations({});
    } else {
      setStage('taste');
      setAnswers(emptyAnswers);
      setSelectedIds([]);
      setCustomizations({});
      setRemarks('');
    }
  }, [launch, editChoice]);

  const recommendations = useMemo(() => getRecommendations(answers), [answers]);
  const selectedFlavours = selectedIds.map(getFlavour).filter((flavour): flavour is Flavour => Boolean(flavour));
  const finalChoice: Choice = {
    flavourIds: selectedIds,
    tastes: answers.tastes,
    strength: answers.strength,
    favouriteId: answers.favouriteId,
    avoid: answers.avoid,
    customizations,
    remarks,
    chosenAt: new Date().toISOString(),
  };

  const updateCustomization = (id: string, value: CustomLevel) => setCustomizations((current) => ({ ...current, [id]: value }));
  const chooseRecommendation = (recommendation: Recommendation) => {
    const second = recommendations.find((item) => item.flavour.id !== recommendation.flavour.id)?.flavour;
    const ids = second ? [recommendation.flavour.id, second.id] : [recommendation.flavour.id];
    setSelectedIds(ids);
    setCustomizations(Object.fromEntries(ids.map((id) => [id, 'Normal'])));
    setActiveDetail(null);
    setStage('customize');
  };
  const goBack = () => {
    if (stage === 'strength') setStage('taste');
    else if (stage === 'favourite') setStage('strength');
    else if (stage === 'results') setStage('favourite');
    else if (stage === 'customize') setStage('results');
    else if (stage === 'final') setStage('customize');
  };

  return (
    <main className="hv-shell hv-page-in">
      <div className="mx-auto max-w-4xl">
        {stage === 'taste' && (
          <div className="hv-rise">
            <StepHeader step={1} total={4} />
            <SectionEyebrow>FIRST, THE FEELING</SectionEyebrow>
            <h1 className="hv-display max-w-2xl text-4xl leading-tight md:text-6xl">What kind of cloud are you in the mood for?</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">Pick as many as you like. Think about the first taste you want to notice.</p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {TASTE_OPTIONS.map((taste) => {
                const selected = answers.tastes.includes(taste);
                return (
                  <button key={taste} className={`hv-press flex min-h-16 items-center justify-between rounded-2xl border px-4 text-left text-sm font-semibold transition-colors ${selected ? 'border-secondary bg-secondary/20 text-primary' : 'border-border bg-card/50 hover:border-secondary/60'}`} onClick={() => setAnswers((current) => ({ ...current, tastes: selected ? current.tastes.filter((item) => item !== taste) : [...current.tastes, taste] }))} aria-pressed={selected} data-testid={`button-taste-${taste.toLowerCase()}`}>
                    {taste}<span className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? 'border-secondary bg-secondary text-secondary-foreground' : 'border-muted-foreground/30'}`}>{selected && <Check size={13} />}</span>
                  </button>
                );
              })}
            </div>
            <button className="hv-press mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-bold text-primary-foreground sm:w-auto" onClick={() => setStage('strength')} data-testid="button-next-taste">Continue <ArrowRight size={17} /></button>
          </div>
        )}

        {stage === 'strength' && (
          <div className="hv-rise">
            <StepHeader step={2} total={4} onBack={goBack} />
            <SectionEyebrow>NOW, THE PACE</SectionEyebrow>
            <h1 className="hv-display max-w-2xl text-4xl leading-tight md:text-6xl">How present should the flavour feel?</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">There is no wrong answer. This only helps us set the volume.</p>
            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {(['Light', 'Medium', 'Strong'] as Strength[]).map((strength) => {
                const selected = answers.strength === strength;
                return (
                  <button key={strength} className={`hv-press relative min-h-36 rounded-3xl border p-5 text-left transition-colors ${selected ? 'border-secondary bg-secondary/18' : 'border-border bg-card/50 hover:border-secondary/60'}`} onClick={() => setAnswers((current) => ({ ...current, strength }))} aria-pressed={selected} data-testid={`button-strength-${strength.toLowerCase()}`}>
                    <span className="flex gap-1.5">
                      {[1, 2, 3].map((dot) => <span className={`h-2.5 w-2.5 rounded-full ${dot <= (strength === 'Light' ? 1 : strength === 'Medium' ? 2 : 3) ? 'bg-secondary' : 'bg-muted'}`} key={dot} />)}
                    </span>
                    <span className="mt-8 block text-lg font-bold">{strength}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{strength === 'Light' ? 'A softer, slower introduction.' : strength === 'Medium' ? 'Balanced and easy to settle into.' : 'Bold enough to hold the room.'}</span>
                    {selected && <Check className="absolute right-5 top-5 text-secondary" size={19} />}
                  </button>
                );
              })}
            </div>
            <button className="hv-press mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-bold text-primary-foreground sm:w-auto" onClick={() => setStage('favourite')} data-testid="button-next-strength">Continue <ArrowRight size={17} /></button>
          </div>
        )}

        {stage === 'favourite' && (
          <div className="hv-rise">
            <StepHeader step={3} total={4} onBack={goBack} />
            <SectionEyebrow>THE FUN DETAIL</SectionEyebrow>
            <h1 className="hv-display max-w-2xl text-4xl leading-tight md:text-6xl">Any flavour you already know you like?</h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">Optional, but useful. Choose one familiar note and we’ll build around it.</p>
            <div className="mt-8 space-y-7">
              {brands.map((brand) => (
                <div key={brand}>
                  <p className="hv-mono mb-3 text-[10px] text-muted-foreground">{brand}</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {flavours.filter((flavour) => flavour.brand === brand).map((flavour) => {
                      const selected = answers.favouriteId === flavour.id;
                      return (
                        <button key={flavour.id} className={`hv-press flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${selected ? 'border-secondary bg-secondary/18' : 'border-border bg-card/50 hover:border-secondary/60'}`} onClick={() => setAnswers((current) => ({ ...current, favouriteId: selected ? null : flavour.id }))} aria-pressed={selected} data-testid={`button-favourite-${flavour.id}`}>
                          <FlavourVisual flavour={flavour} size="sm" />
                          <span className="min-w-0"><span className="block truncate text-sm font-bold">{flavour.name}</span><span className="mt-1 block text-[10px] text-muted-foreground">{flavour.tags.slice(0, 2).join(' · ')}</span></span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-3xl border border-border bg-card/60 p-5">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-sm font-bold">Anything you’d rather avoid?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">We’ll quietly keep these out of your first suggestions.</p></div>
                <Leaf size={19} className="text-accent" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {AVOID_OPTIONS.map((avoid) => {
                  const selected = answers.avoid.includes(avoid);
                  return <button key={avoid} className={`rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${selected ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted-foreground hover:border-accent/50'}`} onClick={() => setAnswers((current) => ({ ...current, avoid: selected ? current.avoid.filter((item) => item !== avoid) : [...current.avoid, avoid] }))} aria-pressed={selected} data-testid={`button-avoid-${avoid.toLowerCase().replaceAll(' ', '-')}`}>{selected && <Check size={12} className="mr-1 inline" />}{avoid}</button>;
                })}
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="hv-press flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-bold text-primary-foreground" onClick={() => setStage('results')} data-testid="button-see-recommendations">Show my recommendations <ArrowRight size={17} /></button>
              <button className="hv-press flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-border px-6 text-sm font-semibold hover:bg-muted" onClick={() => { setAnswers((current) => ({ ...current, surprise: true })); setStage('results'); }} data-testid="button-favourite-surprise">Surprise me instead <Sparkles size={16} /></button>
            </div>
          </div>
        )}

        {stage === 'results' && (
          <div className="hv-rise">
            <StepHeader step={4} total={4} onBack={goBack} />
            <SectionEyebrow>YOUR HILLVIEW SHORTLIST</SectionEyebrow>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div><h1 className="hv-display text-4xl leading-tight md:text-6xl">These feel like you.</h1><p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">Three directions, no scores. Trust the one that makes you curious.</p></div>
              <span className="hv-mono text-[10px] text-muted-foreground">{answers.tastes.length ? answers.tastes.slice(0, 3).join(' · ') : 'A little table-side magic'}</span>
            </div>
            <div className="mt-8 grid gap-4">
              {recommendations.map((recommendation, index) => (
                <article className={`hv-surface hv-press hv-delay-${index + 1} hv-rise rounded-3xl p-5 md:p-7`} key={recommendation.flavour.id} data-testid={`card-recommendation-${recommendation.flavour.id}`}>
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <FlavourVisual flavour={recommendation.flavour} size="lg" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3"><div><p className="hv-mono text-[10px] text-accent">{recommendation.title}</p><h2 className="hv-display mt-1 text-3xl">{recommendation.flavour.name}</h2></div><span className="rounded-full bg-muted px-3 py-1 font-mono text-[9px] text-muted-foreground">{recommendation.flavour.strength}</span></div>
                      <p className="mt-2 text-xs text-muted-foreground">{recommendation.flavour.brand} · {recommendation.pairing}</p>
                      <p className="mt-4 max-w-xl text-sm leading-6">{recommendation.description}</p>
                      <div className="mt-5 flex flex-wrap gap-2">{recommendation.flavour.tags.map((tag) => <span className="rounded-full border border-border px-3 py-1 text-[10px] text-muted-foreground" key={tag}>{tag}</span>)}</div>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-col gap-2 border-t border-border/70 pt-4 sm:flex-row sm:justify-end">
                    <button className="flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setActiveDetail(recommendation.flavour)} data-testid={`button-details-${recommendation.flavour.id}`}>Open details <ChevronDown size={15} /></button>
                    <button className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-primary-foreground" onClick={() => chooseRecommendation(recommendation)} data-testid={`button-choose-${recommendation.flavour.id}`}>Choose this direction <ArrowRight size={15} /></button>
                  </div>
                </article>
              ))}
            </div>
            {activeDetail && <DetailPanel flavour={activeDetail} onClose={() => setActiveDetail(null)} />}
          </div>
        )}

        {stage === 'customize' && (
          <div className="hv-rise">
            <div className="mb-8 flex items-center justify-between"><button className="flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" onClick={goBack} data-testid="button-customize-back"><ArrowLeft size={17} /> Back</button><span className="hv-mono text-[10px] text-muted-foreground">YOUR MIX</span></div>
            <SectionEyebrow>MAKE IT YOURS</SectionEyebrow>
            <h1 className="hv-display max-w-2xl text-4xl leading-tight md:text-6xl">A little less guesswork. A lot more you.</h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Adjust by feel, not percentages. Normal is our balanced starting point.</p>
            <div className="mt-9 space-y-4">
              {selectedFlavours.map((flavour) => (
                <div className="hv-surface rounded-3xl p-4 md:p-5" key={flavour.id} data-testid={`card-customize-${flavour.id}`}>
                  <div className="flex items-center gap-4"><FlavourVisual flavour={flavour} size="md" /><div className="min-w-0 flex-1"><p className="hv-mono text-[10px] text-accent">{flavour.brand}</p><h2 className="hv-display mt-1 text-2xl">{flavour.name}</h2><p className="mt-1 truncate text-xs text-muted-foreground">{flavour.character}</p><p className="mt-2 text-[10px] font-semibold text-secondary-foreground">{flavour.strength} body · {flavour.tags.join(' · ')}</p></div><button className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={() => setSelectedIds((ids) => ids.filter((id) => id !== flavour.id))} aria-label={`Remove ${flavour.name}`} data-testid={`button-remove-${flavour.id}`}><Trash2 size={16} /></button></div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-4"><div className="flex flex-wrap gap-2">{flavour.tags.map((tag) => <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] text-muted-foreground" key={tag}>{tag}</span>)}</div><div className="flex shrink-0 overflow-hidden rounded-xl border border-border bg-muted/50">{(['Less', 'Normal', 'More'] as CustomLevel[]).map((level) => <button key={level} className={`min-h-10 px-2.5 text-[10px] font-bold transition-colors ${customizations[flavour.id] === level ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => updateCustomization(flavour.id, level)} aria-pressed={customizations[flavour.id] === level} data-testid={`button-custom-${level.toLowerCase()}-${flavour.id}`}>{level}</button>)}</div></div>
                </div>
              ))}
            </div>
            <div className="relative mt-4">
              <button className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-dashed border-secondary/70 px-5 text-sm font-bold text-secondary-foreground hover:bg-secondary/10" onClick={() => setAddOpen((open) => !open)} data-testid="button-add-flavour"><span className="flex items-center gap-2"><Plus size={18} /> Add a flavour</span><ChevronDown size={17} className={addOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></button>
              {addOpen && <div className="hv-surface absolute left-0 right-0 top-16 z-20 max-h-80 overflow-y-auto rounded-2xl p-3 shadow-2xl"><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{flavours.filter((flavour) => !selectedIds.includes(flavour.id)).map((flavour) => <button className="flex items-center gap-2 rounded-xl p-2 text-left hover:bg-muted" key={flavour.id} onClick={() => { setSelectedIds((ids) => [...ids, flavour.id]); updateCustomization(flavour.id, 'Normal'); setAddOpen(false); }} data-testid={`button-add-${flavour.id}`}><FlavourVisual flavour={flavour} size="sm" /><span className="min-w-0"><span className="block truncate text-xs font-bold">{flavour.name}</span><span className="block truncate text-[9px] text-muted-foreground">{flavour.brand}</span></span></button>)}</div></div>}
            </div>
            <button className="hv-press mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 font-bold text-primary-foreground sm:w-auto" onClick={() => setStage('final')} disabled={selectedIds.length === 0} data-testid="button-review-choice">Review my choice <ArrowRight size={17} /></button>
          </div>
        )}

        {stage === 'final' && (
          <div className="hv-rise">
            <div className="mb-8 flex items-center justify-between"><button className="flex min-h-10 items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground" onClick={goBack} data-testid="button-final-back"><ArrowLeft size={17} /> Edit mix</button><span className="hv-mono text-[10px] text-muted-foreground">READY WHEN YOU ARE</span></div>
            <SectionEyebrow>ONE LAST LOOK</SectionEyebrow>
            <h1 className="hv-display max-w-2xl text-4xl leading-tight md:text-6xl">Your table is going to like this.</h1>
            <div className="mt-8 grid gap-5 md:grid-cols-[1fr_.78fr]">
              <div className="hv-surface rounded-3xl p-5 md:p-7">
                <div className="flex items-center justify-between border-b border-border/70 pb-4"><span className="hv-mono text-[10px] text-accent">CUSTOMISED MIX</span><span className="text-xs text-muted-foreground">{answers.strength} session</span></div>
                <div className="mt-5 space-y-3">{selectedFlavours.length ? selectedFlavours.map((flavour) => <div className="flex items-center gap-3" key={flavour.id}><FlavourVisual flavour={flavour} size="sm" /><div className="min-w-0 flex-1"><p className="text-sm font-bold">{flavour.name}</p><p className="text-[10px] text-muted-foreground">{flavour.brand} · {customizations[flavour.id] ?? 'Normal'}</p></div><Check size={16} className="text-secondary" /></div>) : <p className="text-sm text-muted-foreground">Your expert will make a thoughtful surprise.</p>}</div>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-border/70 pt-5">{(answers.tastes.length ? answers.tastes : ['Surprise me']).map((taste) => <span className="rounded-full bg-secondary/15 px-3 py-1.5 text-[10px] font-semibold text-secondary-foreground" key={taste}>{taste}</span>)}</div>
              </div>
              <div className="rounded-3xl bg-primary p-5 text-primary-foreground md:p-7"><p className="hv-mono text-[10px] text-secondary">A NOTE FOR THE EXPERT</p><label className="mt-5 block text-sm font-semibold" htmlFor="remarks">Anything else?</label><textarea id="remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} className="mt-3 min-h-36 w-full resize-none rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4 text-sm leading-6 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-secondary focus:outline-none" placeholder="Tell us about the mood, the table, or anything to leave out." data-testid="textarea-remarks" /><p className="mt-4 text-xs leading-5 text-primary-foreground/55">This note travels with your mix to Hillview Hookah Expert on WhatsApp.</p></div>
            </div>
            <button className="hv-press mt-6 flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-secondary px-6 font-bold text-secondary-foreground shadow-lg shadow-secondary/20" onClick={() => { onSave(finalChoice); openWhatsApp(finalChoice); }} data-testid="button-order-customised-choice">ORDER CUSTOMISED CHOICE <Send size={18} /></button>
            <p className="mt-3 text-center text-[10px] text-muted-foreground">We’ll open WhatsApp with your exact mix ready to send.</p>
          </div>
        )}
      </div>
    </main>
  );
}

function DetailPanel({ flavour, onClose }: { flavour: Flavour; onClose: () => void }) {
  return (
    <div className="fixed inset-x-4 bottom-24 z-30 mx-auto max-w-lg rounded-3xl bg-primary p-5 text-primary-foreground shadow-2xl shadow-primary/30 md:bottom-8" role="dialog" aria-label={`${flavour.name} details`}>
      <div className="flex items-start gap-4"><FlavourVisual flavour={flavour} size="md" /><div className="min-w-0 flex-1"><p className="hv-mono text-[10px] text-secondary">{flavour.brand}</p><h2 className="hv-display mt-1 text-3xl">{flavour.name}</h2><p className="mt-2 text-sm leading-6 text-primary-foreground/70">{flavour.character}</p></div><button className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/10" onClick={onClose} aria-label="Close flavour details" data-testid="button-close-details"><X size={17} /></button></div>
      <div className="mt-5 flex flex-wrap gap-2">{flavour.tags.map((tag) => <span className="rounded-full border border-primary-foreground/20 px-3 py-1 text-[10px]" key={tag}>{tag}</span>)}<span className="rounded-full border border-secondary/50 px-3 py-1 text-[10px] text-secondary">{flavour.strength} body</span></div>
    </div>
  );
}

function ChoicePage({ choice, onEdit, onReset }: { choice: Choice | null; onEdit: () => void; onReset: () => void }) {
  const selected = choice?.flavourIds.map(getFlavour).filter((flavour): flavour is Flavour => Boolean(flavour)) ?? [];
  return (
    <main className="hv-shell hv-page-in">
      <div className="mx-auto max-w-4xl">
        <SectionEyebrow>YOUR HILLVIEW NOTE</SectionEyebrow>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><h1 className="hv-display text-5xl md:text-6xl">My Choice</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">{choice ? 'Your last cloud is saved here on this device.' : 'Nothing saved yet. Let’s find your first cloud.'}</p></div>{choice && <span className="hv-mono text-[10px] text-secondary">SAVED LOCALLY</span>}</div>
        {!choice ? (
          <div className="hv-surface mt-10 flex flex-col items-center rounded-[2rem] px-6 py-16 text-center"><span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-secondary/20 text-secondary-foreground"><Sparkles size={25} /></span><h2 className="hv-display mt-6 text-3xl">A blank page, for now.</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Answer a few easy questions and we’ll keep your finished choice close by.</p><Link href="/find" className="mt-7 flex min-h-13 items-center gap-2 rounded-2xl bg-primary px-6 text-sm font-bold text-primary-foreground" data-testid="link-empty-find">Find my hookah <ArrowRight size={16} /></Link></div>
        ) : (
          <>
            <div className="mt-9 grid gap-4 md:grid-cols-[1.05fr_.95fr]">
              <div className="rounded-[2rem] bg-primary p-6 text-primary-foreground md:p-8"><div className="flex items-center justify-between"><span className="hv-mono text-[10px] text-secondary">THE MIX</span><Flame size={19} className="text-secondary" /></div><div className="mt-8 space-y-4">{selected.map((flavour) => <div className="flex items-center gap-3" key={flavour.id} data-testid={`text-saved-flavour-${flavour.id}`}><FlavourVisual flavour={flavour} size="sm" /><div><p className="text-sm font-bold">{flavour.name}</p><p className="text-[10px] text-primary-foreground/55">{flavour.brand} · {choice.customizations[flavour.id] ?? 'Normal'}</p></div></div>)}</div><div className="mt-8 border-t border-primary-foreground/15 pt-5"><p className="hv-mono text-[9px] text-primary-foreground/50">MOOD</p><p className="mt-2 text-sm">{choice.tastes.length ? choice.tastes.join(' · ') : 'A Hillview surprise'}</p></div></div>
              <div className="hv-surface rounded-[2rem] p-6 md:p-8"><div className="flex items-center justify-between"><span className="hv-mono text-[10px] text-accent">TABLE NOTES</span><span className="rounded-full bg-muted px-3 py-1 text-[10px] font-semibold">{choice.strength}</span></div><p className="mt-8 text-sm leading-7">{choice.remarks || 'No extra notes — the blend can speak for itself.'}</p><div className="mt-8 border-t border-border/70 pt-5"><p className="text-xs font-bold">Avoiding</p><p className="mt-2 text-xs text-muted-foreground">{choice.avoid.length ? choice.avoid.join(' · ') : 'Nothing noted'}</p></div></div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row"><button className="flex min-h-13 flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 text-sm font-bold hover:bg-muted" onClick={onEdit} data-testid="button-edit-choice"><Edit3 size={16} /> EDIT</button><button className="flex min-h-13 flex-[1.5] items-center justify-center gap-2 rounded-2xl bg-secondary px-5 text-sm font-bold text-secondary-foreground shadow-lg shadow-secondary/15" onClick={() => openWhatsApp(choice)} data-testid="button-order-whatsapp"><Send size={16} /> ORDER ON WHATSAPP</button><button className="flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-border px-5 text-sm font-bold text-muted-foreground hover:border-destructive/40 hover:text-destructive" onClick={onReset} data-testid="button-start-over"><RotateCcw size={16} /> START OVER</button></div>
          </>
        )}
      </div>
    </main>
  );
}

function NotFoundPage() {
  return <main className="hv-shell flex min-h-[60vh] flex-col items-center justify-center text-center"><span className="hv-mono text-[10px] text-accent">404 / WRONG TURN</span><h1 className="hv-display mt-4 text-5xl">That cloud drifted away.</h1><Link href="/" className="mt-7 flex min-h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-bold text-primary-foreground" data-testid="link-not-found-home">Back home <ArrowRight size={16} /></Link></main>;
}

function RouterView({ choice, onSave, onEdit, onReset, launch, setLaunch }: { choice: Choice | null; onSave: (choice: Choice) => void; onEdit: () => void; onReset: () => void; launch: 'fresh' | 'surprise' | 'edit'; setLaunch: (launch: 'fresh' | 'surprise' | 'edit') => void }) {
  return (
    <Switch>
      <Route path="/"><HomePage onFind={() => { setLaunch('fresh'); }} onSurprise={() => { setLaunch('surprise'); }} /></Route>
      <Route path="/find"><FinderPage onSave={onSave} editChoice={choice} launch={launch} /></Route>
      <Route path="/choice"><ChoicePage choice={choice} onEdit={onEdit} onReset={onReset} /></Route>
      <Route><NotFoundPage /></Route>
    </Switch>
  );
}

function App() {
  const [, setLocation] = useLocation();
  const [choice, setChoice] = useState<Choice | null>(readChoice);
  const [launch, setLaunch] = useState<'fresh' | 'surprise' | 'edit'>('fresh');

  useEffect(() => {
    if (choice) localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
    else localStorage.removeItem(STORAGE_KEY);
  }, [choice]);

  const setFinderLaunch = (next: 'fresh' | 'surprise' | 'edit') => {
    setLaunch(next);
    setLocation('/find');
  };

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AppShell choice={choice}>
        <RouterView
          choice={choice}
          onSave={(next) => { setChoice(next); setLocation('/choice'); }}
          onEdit={() => setFinderLaunch('edit')}
          onReset={() => { setChoice(null); setFinderLaunch('fresh'); }}
          launch={launch}
          setLaunch={setFinderLaunch}
        />
      </AppShell>
    </WouterRouter>
  );
}

export default App;
