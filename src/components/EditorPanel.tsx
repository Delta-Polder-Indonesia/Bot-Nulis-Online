import type { IdentityField, PaperSettings } from "../types";
import TextEditor from "./TextEditor";
import IdentityEditor from "./IdentityEditor";
import FormattingTools from "./FormattingTools";
import PresetManager from "./PresetManager";

interface EditorPanelProps {
  text: string;
  setText: (text: string) => void;
  identities: IdentityField[];
  setIdentities: (identities: IdentityField[]) => void;
  settings: PaperSettings;
  onUpdateSetting: <K extends keyof PaperSettings>(
    key: K,
    value: PaperSettings[K]
  ) => void;
  onLoadPreset: (settings: PaperSettings) => void;
}

export default function EditorPanel({
  text,
  setText,
  identities,
  setIdentities,
  settings,
  onUpdateSetting,
  onLoadPreset,
}: EditorPanelProps) {
  return (
    <div
      className="lg:col-span-4 space-y-4 overflow-y-auto pr-1
                 pb-20 panel-scroll"
    >
      <TextEditor text={text} setText={setText} />
      <IdentityEditor
        identities={identities}
        setIdentities={setIdentities}
      />
      <FormattingTools settings={settings} onUpdate={onUpdateSetting} />
      <PresetManager
        currentSettings={settings}
        onLoadPreset={onLoadPreset}
      />
    </div>
  );
}