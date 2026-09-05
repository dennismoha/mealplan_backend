import { useSaveLocalNamePronunciationMutation } from "../store/mealPlanApi";
import { useEffect, useRef, useState } from "react";
import type { Country, FoodItem, FoodLocalName } from "../api";

export function LocalNamesEditor({ countries, value, onChange, onRecordingChange }: {
  onRecordingChange: (busy: boolean) => void;
  countries: Country[];
  value: FoodLocalName[];
  onChange: (names: FoodLocalName[]) => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  const update = (index: number, patch: Partial<FoodLocalName>) =>
    onChange(value.map((name, i) => i === index ? { ...name, ...patch } : name));
  return <section className="stack-fields">
    <span>Local names <small>optional</small></span>
    <p>Add names used across a country, by a tribe, or in an official language.</p>
    {value.map((entry, index) => <fieldset key={index} className="stack-fields">
      <legend>Local name {index + 1}</legend>
      <label><span>Country</span><select required value={entry.country_id || ""} onChange={e => update(index, { country_id: Number(e.target.value) })}>
        <option value="">Choose a country…</option>
        {countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
      </select></label>
      <label><span>Name type</span><select value={entry.scope} onChange={e => update(index, { scope: e.target.value as FoodLocalName["scope"], tribe_name: "", language_name: "" })}>
        <option value="countrywide">Countrywide</option><option value="tribal">Tribal</option><option value="official_language">Official language</option>
      </select></label>
      {entry.scope === "tribal" && <label><span>Tribe name</span><input required maxLength={100} value={entry.tribe_name || ""} onChange={e => update(index, { tribe_name: e.target.value })} /></label>}
      {entry.scope === "official_language" && <label><span>Official language</span><input required maxLength={100} value={entry.language_name || ""} onChange={e => update(index, { language_name: e.target.value })} /></label>}
      <label><span>Local name</span><input required maxLength={255} value={entry.name} onChange={e => update(index, { name: e.target.value })} /></label>
      <NameRecorder value={entry.pronunciation_audio} disabled={active !== null && active !== index} onChange={audio => update(index, { pronunciation_audio: audio })} onBusy={busy => { setActive(busy ? index : null); onRecordingChange(busy); }} />
      <button type="button" disabled={active !== null} className="danger" onClick={() => onChange(value.filter((_, i) => i !== index))}>Remove name {index + 1}</button>
    </fieldset>)}
    {!countries.length && <small>Add a country before adding local names.</small>}
    <button type="button" className="secondary" disabled={!countries.length} onClick={() => onChange([...value, { country_id: 0, scope: "countrywide", name: "" }])}>＋ Add local name</button>
  </section>;
}

export function LocalNamesList({ item, playback = false, canManage = false }: { item: FoodItem; playback?: boolean; canManage?: boolean }) {
  return <>
    {item.local_name && <span className="local-name">{item.local_name}</span>}
    {item.local_names?.map((entry, index) => <span className="local-name" style={{ display: "block" }} key={entry.id ?? index}>
      {entry.name} · {entry.country?.name || "Country"} · {entry.scope === "tribal" ? `${entry.tribe_name} tribe` : entry.scope === "official_language" ? `${entry.language_name} (official language)` : "Countrywide"}
      {playback && !canManage && (entry.pronunciation_url ? <audio controls preload="none" src={entry.pronunciation_url} aria-label={`Pronunciation of ${entry.name}`} /> : <small> · No recording yet</small>)}
      {playback && canManage && entry.id && <SavedNameRecording entry={entry} foodId={item.food_itemID} />}
    </span>)}
  </>;
}

function NameRecorder({ value, disabled, onChange, onBusy }: {
  value?: string; disabled: boolean; onChange: (audio?: string) => void; onBusy: (busy: boolean) => void;
}) {
  const callbacks = useRef({ onChange, onBusy });
  callbacks.current = { onChange, onBusy };
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const mounted = useRef(true);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach(track => track.stop());
    };
  }, []);
  const start = async () => {
    setError(""); setProcessing(true); onBusy(true);
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!mounted.current) { media.getTracks().forEach(track => track.stop()); return; }
      stream.current = media;
      const next = new MediaRecorder(media);
      const chunks: Blob[] = [];
      next.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
      next.onstop = () => {
        media.getTracks().forEach(track => track.stop());
        if (!mounted.current) return;
        setRecording(false); setProcessing(true);
        const reader = new FileReader();
        reader.onload = () => { if (mounted.current) { callbacks.current.onChange(String(reader.result)); setProcessing(false); callbacks.current.onBusy(false); } };
        reader.onerror = () => { if (mounted.current) { setError("Could not read the recording. Please try again."); setProcessing(false); onBusy(false); } };
        reader.readAsDataURL(new Blob(chunks, { type: next.mimeType || "audio/webm" }));
      };
      recorder.current = next; next.start(); setRecording(true); setProcessing(false);
    } catch {
      stream.current?.getTracks().forEach(track => track.stop());
      if (mounted.current) { setError("Allow microphone access to record this name."); setProcessing(false); onBusy(false); }
    }
  };
  return <div className="voice-field">
    <span>Pronunciation of this name <small>optional</small></span>
    {value && <audio controls src={value} />}
    <div className="recording-actions">
      {recording ? <button type="button" onClick={() => recorder.current?.stop()}>Stop recording</button> : <button type="button" className="secondary" disabled={disabled || processing} onClick={start}>{processing ? "Preparing…" : value ? "Record again" : "● Record name"}</button>}
      {value && <button type="button" className="danger" disabled={disabled || recording || processing} onClick={() => onChange(undefined)}>Delete recording</button>}
    </div>
    {error && <small className="form-error">{error}</small>}
  </div>;
}

function SavedNameRecording({ entry, foodId }: { entry: FoodLocalName; foodId: string }) {
  const [save, state] = useSaveLocalNamePronunciationMutation();
  const [draft, setDraft] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState(entry.pronunciation_url);
  const persist = async (audio: string | null) => {
    try {
      const result = await save({ id: foodId, nameId: entry.id!, audio }).unwrap();
      setUrl(result.data.pronunciation_url); setDraft(undefined);
    } catch { /* Mutation state displays the failure and retains the draft. */ }
  };
  return <span style={{ display: "block" }}>
    {url && <audio controls preload="none" src={url} />}
    <NameRecorder value={draft} disabled={state.isLoading} onChange={setDraft} onBusy={setBusy} />
    {draft && <button type="button" disabled={busy || state.isLoading} onClick={() => persist(draft)}>Save pronunciation</button>}
    {url && <button type="button" disabled={busy || state.isLoading} onClick={() => persist(null)}>Delete saved recording</button>}
    {state.isError && <small className="form-error">Could not save the pronunciation. Please try again.</small>}
  </span>;
}
