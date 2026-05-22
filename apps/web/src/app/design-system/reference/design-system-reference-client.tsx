"use client";

import { useState } from "react";
import {
  Search,
  ChevronRight,
  Type,
  Palette,
  Layers,
  Box,
  Badge,
  AlertTriangle,
  Lock,
  CheckSquare2,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib";

const sections = [
  { id: "colors", title: "Colors", icon: Palette },
  { id: "typography", title: "Typography", icon: Type },
  { id: "spacing", title: "Spacing & Radii", icon: Layers },
  { id: "shadows", title: "Shadows", icon: Box },
  { id: "buttons", title: "Buttons", icon: Layers },
  { id: "inputs", title: "Inputs", icon: Box },
  { id: "cards", title: "Cards & Panels", icon: Layers },
  { id: "badges", title: "Badges & Tags", icon: Badge },
  { id: "notices", title: "Notice Cards", icon: AlertTriangle },
  { id: "forms", title: "Forms", icon: Box },
  { id: "components", title: "Components", icon: CheckSquare2 },
];

function ColorSwatch({
  label,
  variable,
  value,
}: {
  label: string;
  variable: string;
  value: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/60 bg-card/50">
      <div className="h-20 w-full" style={{ background: value }} />
      <div className="space-y-1 p-3">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-[10px] font-mono text-muted-foreground">
          {variable}
        </p>
      </div>
    </div>
  );
}

function CollapsibleSection({
  id,
  title,
  icon: Icon,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section id={id} className="space-y-4 scroll-mt-24">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/60 px-5 py-4 text-left transition hover:border-primary/40 hover:bg-card/80"
      >
        <div className="flex items-center gap-3">
          <Icon className="size-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        </div>
        {isOpen ? (
          <ChevronUp className="size-5 text-muted-foreground transition-transform" />
        ) : (
          <ChevronRight className="size-5 text-muted-foreground transition-transform" />
        )}
      </button>
      {isOpen && <div className="pl-2">{children}</div>}
    </section>
  );
}

export function DesignSystemReferenceClient() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="sticky top-0 h-screen w-64 border-r border-border/60 bg-card/80 backdrop-blur-lg">
          <div className="p-6">
            <span className="eyebrow mb-4 inline-block">Internal</span>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Design System
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Visual reference for HeyClaude UI
            </p>
          </div>
          <nav className="px-4 pb-6">
            <ul className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                    >
                      <Icon className="size-4" />
                      {section.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 border-t border-border/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </aside>

        <main className="min-h-screen flex-1">
          <div className="container-shell py-12">
            <div className="max-w-4xl space-y-6">
              <div className="mb-8 space-y-4">
                <h1 className="display-title text-foreground">
                  Design System Reference
                </h1>
                <p className="text-lg text-muted-foreground">
                  Comprehensive visual reference for design tokens, UI
                  primitives, and component states.
                </p>
              </div>

              <CollapsibleSection
                id="colors"
                title="Colors"
                icon={Palette}
                defaultOpen
              >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <ColorSwatch
                    label="Background"
                    variable="--background"
                    value="var(--background)"
                  />
                  <ColorSwatch
                    label="Foreground"
                    variable="--foreground"
                    value="var(--foreground)"
                  />
                  <ColorSwatch
                    label="Primary"
                    variable="--primary"
                    value="var(--primary)"
                  />
                  <ColorSwatch
                    label="Primary Foreground"
                    variable="--primary-foreground"
                    value="var(--primary-foreground)"
                  />
                  <ColorSwatch
                    label="Secondary"
                    variable="--secondary"
                    value="var(--secondary)"
                  />
                  <ColorSwatch
                    label="Secondary Foreground"
                    variable="--secondary-foreground"
                    value="var(--secondary-foreground)"
                  />
                  <ColorSwatch
                    label="Muted"
                    variable="--muted"
                    value="var(--muted)"
                  />
                  <ColorSwatch
                    label="Muted Foreground"
                    variable="--muted-foreground"
                    value="var(--muted-foreground)"
                  />
                  <ColorSwatch
                    label="Accent"
                    variable="--accent"
                    value="var(--accent)"
                  />
                  <ColorSwatch
                    label="Accent Foreground"
                    variable="--accent-foreground"
                    value="var(--accent-foreground)"
                  />
                  <ColorSwatch
                    label="Destructive"
                    variable="--destructive"
                    value="var(--destructive)"
                  />
                  <ColorSwatch
                    label="Border"
                    variable="--border"
                    value="var(--border)"
                  />
                  <ColorSwatch
                    label="Card"
                    variable="--card"
                    value="var(--card)"
                  />
                  <ColorSwatch
                    label="Card Foreground"
                    variable="--card-foreground"
                    value="var(--card-foreground)"
                  />
                  <ColorSwatch
                    label="Input"
                    variable="--input"
                    value="var(--input)"
                  />
                  <ColorSwatch
                    label="Ring"
                    variable="--ring"
                    value="var(--ring)"
                  />
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="typography"
                title="Typography"
                icon={Type}
              >
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      .display-title
                    </p>
                    <p className="display-title text-foreground">
                      Display Title
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      .section-title
                    </p>
                    <p className="section-title text-foreground">
                      Section Title
                    </p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      h3 text-2xl font-semibold tracking-tight
                    </p>
                    <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                      Large Heading
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base leading-8 text-foreground">
                      Base body text — Plus Jakarta Sans, 16px, 1.75
                      line-height.
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Secondary body text — smaller, muted color for
                      descriptions.
                    </p>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Eyebrow / Label text
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-sans text-foreground">
                      Sans-serif — var(--font-sans)
                    </p>
                    <p className="font-mono text-foreground">
                      Mono — var(--font-mono)
                    </p>
                    <p className="font-serif text-foreground">
                      Serif — var(--font-serif)
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="spacing"
                title="Spacing & Radii"
                icon={Layers}
              >
                <div className="space-y-6">
                  <div className="surface-panel p-4">
                    <p className="text-sm text-foreground">
                      .container-shell — max 1240px, centered with 1rem side
                      gutters
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {[
                      {
                        label: "sm",
                        className: "rounded-sm",
                        size: "h-12 w-12",
                      },
                      {
                        label: "md",
                        className: "rounded-md",
                        size: "h-12 w-12",
                      },
                      {
                        label: "lg",
                        className: "rounded-lg",
                        size: "h-12 w-12",
                      },
                      {
                        label: "xl",
                        className: "rounded-xl",
                        size: "h-12 w-12",
                      },
                      {
                        label: "2xl",
                        className: "rounded-2xl",
                        size: "h-12 w-12",
                      },
                      {
                        label: "3xl",
                        className: "rounded-3xl",
                        size: "h-12 w-12",
                      },
                    ].map((r) => (
                      <div
                        key={r.label}
                        className="flex flex-col items-center gap-2"
                      >
                        <div
                          className={cn(
                            "border border-border bg-primary/20",
                            r.className,
                            r.size,
                          )}
                        />
                        <span className="text-[10px] text-muted-foreground">
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection id="shadows" title="Shadows" icon={Box}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    "shadow-2xs",
                    "shadow-xs",
                    "shadow-sm",
                    "shadow",
                    "shadow-md",
                    "shadow-lg",
                    "shadow-xl",
                    "shadow-2xl",
                  ].map((shadow) => (
                    <div
                      key={shadow}
                      className={cn(
                        "h-20 rounded-xl border border-border bg-card flex items-center justify-center",
                        shadow,
                      )}
                    >
                      <span className="text-xs text-muted-foreground">
                        {shadow}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

              <CollapsibleSection id="buttons" title="Buttons" icon={Layers}>
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3">
                    <Button variant="default">Default</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="xs">Extra small</Button>
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">
                      <span className="size-4">+</span>
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                    <Button aria-invalid>Invalid</Button>
                    <Button className="hover:opacity-90">Forced hover</Button>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection id="inputs" title="Inputs" icon={Box}>
                <div className="space-y-6 max-w-md">
                  <input
                    type="text"
                    placeholder="Placeholder text"
                    className="directory-input"
                  />
                  <input
                    type="text"
                    value="Filled value"
                    readOnly
                    className="directory-input"
                  />
                  <div className="directory-search-shell">
                    <Search className="size-4 text-muted-foreground/75" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="directory-search-input"
                    />
                  </div>
                  <textarea
                    placeholder="Enter details..."
                    className="submit-textarea"
                  />
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">Option A</SelectItem>
                      <SelectItem value="b">Option B</SelectItem>
                      <SelectItem value="c">Option C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="cards"
                title="Cards & Panels"
                icon={Layers}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="surface-panel p-4">
                    <p className="text-sm font-medium text-foreground">
                      .surface-panel
                    </p>
                    <p className="text-xs text-muted-foreground">
                      rounded-2xl border border-border/80 bg-card/80 shadow-sm
                      backdrop-blur
                    </p>
                  </div>
                  <div className="section-card p-4">
                    <p className="text-sm font-medium text-foreground">
                      .section-card
                    </p>
                    <p className="text-xs text-muted-foreground">
                      rounded-3xl border border-border/80 bg-card/90 shadow-sm
                      backdrop-blur
                    </p>
                  </div>
                  <div className="directory-card p-4">
                    <p className="text-sm font-medium text-foreground">
                      .directory-card
                    </p>
                    <p className="text-xs text-muted-foreground">
                      rounded-2xl border border-border bg-card shadow-sm
                    </p>
                  </div>
                  <div className="directory-stack-card p-4">
                    <p className="text-sm font-medium text-foreground">
                      .directory-stack-card
                    </p>
                    <p className="text-xs text-muted-foreground">
                      flex gap-4 rounded-[1.35rem] border border-border/80
                      bg-card/96
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="badges"
                title="Badges & Tags"
                icon={Badge}
              >
                <div className="flex flex-wrap gap-3">
                  <span className="eyebrow">Eyebrow</span>
                  <span className="directory-tag">Directory tag</span>
                  <span className="distribution-badge">Distribution badge</span>
                  <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                    Rounded badge
                  </span>
                  <span className="detail-related-badge">Related badge</span>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="notices"
                title="Notice Cards"
                icon={AlertTriangle}
              >
                <div className="space-y-4">
                  <div className="entry-notice-card entry-notice-card-safety">
                    <div className="flex items-start gap-3">
                      <div className="entry-notice-card-icon">
                        <AlertTriangle className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Safety notice
                        </p>
                        <p className="text-xs text-muted-foreground">
                          .entry-notice-card-safety
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="entry-notice-card entry-notice-card-privacy">
                    <div className="flex items-start gap-3">
                      <div className="entry-notice-card-icon">
                        <Lock className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Privacy notice
                        </p>
                        <p className="text-xs text-muted-foreground">
                          .entry-notice-card-privacy
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection id="forms" title="Forms" icon={Box}>
                <div className="max-w-xl">
                  <div className="submit-form-card space-y-5">
                    <div className="space-y-2">
                      <label className="submit-label">Label</label>
                      <input
                        type="text"
                        placeholder="Input placeholder"
                        className="submit-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="submit-label">Description</label>
                      <textarea
                        placeholder="Textarea placeholder"
                        className="submit-textarea"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="submit-label">Category</label>
                      <Select>
                        <SelectTrigger className="submit-select-trigger">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agents">Agents</SelectItem>
                          <SelectItem value="mcp">MCP Servers</SelectItem>
                          <SelectItem value="skills">Skills</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="submit-primary-button">Submit</Button>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="components"
                title="Components"
                icon={CheckSquare2}
              >
                <div className="space-y-6">
                  <div className="space-y-3 max-w-xl">
                    <div className="checklist-item">
                      <div className="checklist-item-box" />
                      <span className="text-sm text-foreground">
                        Unchecked checklist item
                      </span>
                    </div>
                    <div className="checklist-item checklist-item-complete">
                      <div className="checklist-item-box checklist-item-box-complete">
                        <CheckSquare2 className="size-3" />
                      </div>
                      <span className="text-sm text-foreground">
                        Complete checklist item
                      </span>
                    </div>
                  </div>
                  <div className="directory-vote-rail">
                    <div className="vote-button">
                      <ChevronUp className="size-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      42
                    </span>
                    <div className="vote-button">
                      <ChevronDown className="size-4" />
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
