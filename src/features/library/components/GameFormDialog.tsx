import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { dialogApi } from "../../../api/dialogApi";
import { Dialog } from "../../../components/ui/Dialog";
import type { Game, GameInput } from "../../../types/game";
import { createGameInput } from "../../../utils/gameInput";

interface GameFormDialogProps {
  /** Có `game` là chế độ sửa, không có là chế độ thêm mới. */
  game?: Game;
  onSubmit: (input: GameInput) => Promise<boolean>;
  onClose: () => void;
}

interface FormState {
  name: string;
  developer: string;
  genre: string;
  releaseYear: string;
  exePath: string;
  launchArgs: string;
  description: string;
}

function toForm(game?: Game): FormState {
  return {
    name: game?.name ?? "",
    developer: game?.developer ?? "",
    genre: game?.genre ?? "",
    releaseYear: game?.releaseYear?.toString() ?? "",
    exePath: game?.exePath ?? "",
    launchArgs: game?.launchArgs ?? "",
    description: game?.description ?? "",
  };
}

function nameFromPath(path: string): string {
  const file = path.split(/[\\/]/).pop() ?? "";
  return file.replace(/\.exe$/i, "");
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function GameFormDialog({ game, onSubmit, onClose }: GameFormDialogProps) {
  const isEdit = game !== undefined;
  const [form, setForm] = useState<FormState>(() => toForm(game));
  const [saving, setSaving] = useState(false);

  const bind =
    (key: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const browse = async () => {
    const path = await dialogApi.pickExe();
    if (path) {
      setForm((prev) => ({ ...prev, exePath: path, name: prev.name || nameFromPath(path) }));
    }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const year = Number.parseInt(form.releaseYear, 10);
    const ok = await onSubmit(
      createGameInput({
        name: form.name,
        exePath: form.exePath,
        developer: form.developer,
        genre: form.genre,
        description: form.description,
        launchArgs: form.launchArgs,
        releaseYear: Number.isNaN(year) ? null : year,
        source: game?.source ?? "manual",
      }),
    );
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <Dialog title={isEdit ? "Sửa thông tin game" : "Thêm game"} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="dialog__body">
          <Field label="Tên game">
            <input className="input" value={form.name} onChange={bind("name")} autoFocus />
          </Field>
          <Field label="File chạy (.exe)">
            <div className="field-row">
              <input className="input" value={form.exePath} onChange={bind("exePath")} placeholder="C:\Games\Game\game.exe" />
              <button type="button" className="btn" onClick={browse}>
                Chọn…
              </button>
            </div>
          </Field>
          <Field label="Tham số khởi chạy (tuỳ chọn)">
            <input className="input" value={form.launchArgs} onChange={bind("launchArgs")} placeholder="-windowed" />
          </Field>
          <div className="field-grid">
            <Field label="Thể loại (cách nhau bằng dấu ·)">
              <input className="input" value={form.genre} onChange={bind("genre")} placeholder="Nhập vai · Phiêu lưu" />
            </Field>
            <Field label="Năm phát hành">
              <input className="input" value={form.releaseYear} onChange={bind("releaseYear")} inputMode="numeric" />
            </Field>
          </div>
          <Field label="Nhà phát triển">
            <input className="input" value={form.developer} onChange={bind("developer")} />
          </Field>
          <Field label="Mô tả">
            <textarea className="input" value={form.description} onChange={bind("description")} />
          </Field>
        </div>
        <div className="dialog__foot">
          <button type="button" className="btn" onClick={onClose}>
            Huỷ
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {isEdit ? "Lưu" : "Thêm"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}