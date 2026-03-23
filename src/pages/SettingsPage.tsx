import { useState } from "react";
import { Moon, Sun, Globe, MessageSquare, Shield, Beaker } from "lucide-react";

const SettingsPage = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [responseLength, setResponseLength] = useState<"short" | "balanced" | "detailed">("balanced");
  const [saveHistory, setSaveHistory] = useState(true);

  return (
    <div className="min-h-screen pt-14 pb-20 px-4">
      <div className="max-w-lg mx-auto pt-6">
        <h1 className="font-display text-xl tracking-wider text-foreground mb-6">Settings</h1>

        {/* General */}
        <Section title="General">
          <SettingRow icon={theme === "dark" ? Moon : Sun} label="Theme">
            <div className="flex gap-1">
              {(["dark", "light"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1 rounded text-xs capitalize transition-all ${
                    theme === t ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </SettingRow>
          <SettingRow icon={Globe} label="Language">
            <span className="text-xs text-muted-foreground">English</span>
          </SettingRow>
        </Section>

        {/* AI Settings */}
        <Section title="AI Settings">
          <SettingRow icon={MessageSquare} label="Response Length">
            <div className="flex gap-1">
              {(["short", "balanced", "detailed"] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setResponseLength(l)}
                  className={`px-2.5 py-1 rounded text-[11px] capitalize transition-all ${
                    responseLength === l ? "bg-primary/20 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </SettingRow>
        </Section>

        {/* Privacy */}
        <Section title="Privacy">
          <SettingRow icon={Shield} label="Save Chat History">
            <button
              onClick={() => setSaveHistory(!saveHistory)}
              className={`w-10 h-5 rounded-full transition-all relative ${saveHistory ? "bg-primary/40" : "bg-muted"}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                saveHistory ? "left-5 bg-primary" : "left-0.5 bg-muted-foreground"
              }`} />
            </button>
          </SettingRow>
        </Section>

        {/* Advanced */}
        <Section title="Advanced">
          <SettingRow icon={Beaker} label="Experimental Features">
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">Coming soon</span>
          </SettingRow>
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h2 className="text-[10px] font-display tracking-[0.2em] text-muted-foreground mb-2.5">{title.toUpperCase()}</h2>
    <div className="glass-panel divide-y divide-border/30 rounded-lg overflow-hidden">
      {children}
    </div>
  </div>
);

const SettingRow = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between px-4 py-3.5">
    <div className="flex items-center gap-3">
      <Icon size={15} className="text-primary" />
      <span className="text-sm text-foreground">{label}</span>
    </div>
    {children}
  </div>
);

export default SettingsPage;
