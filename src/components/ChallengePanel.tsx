// Challenge 1 tab: What can be built at this site?
import React, { useState } from 'react';
import { ClipboardList, ExternalLink, Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import { TownInfo } from '../types';

interface Item {
  label: string;
  whatToLookFor: string;
  whereToFindIt: string;
}
interface Reform {
  title: string;
  whatItMeans: string;
  howItCouldApply: string;
}
interface LotCheck {
  districtHint: string;
  items: Item[];
  reforms: Reform[];
}

interface Props {
  address: string;
  town: TownInfo | null;
}

export const ChallengePanel: React.FC<Props> = ({ address, town }) => {
  const [check, setCheck] = useState<LotCheck | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draft = async () => {
    if (!town) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/lot-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          town: town.town,
          zoningUrl: town.zoningUrl,
          whereZoningSits: town.whereZoningSits,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not draft the checklist.');
      setCheck(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const rows: Item[] = check
    ? [
        {
          label: 'Zoning district',
          whatToLookFor: 'The district letters for this parcel, for example R-2.',
          whereToFindIt: check.districtHint,
        },
        ...check.items,
      ]
    : [];

  return (
    <section className="w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Challenge 1</p>
            <h3 className="text-2xl font-bold text-slate-900">What can be built at this site?</h3>
          </div>
        </div>
        <button
          onClick={draft}
          disabled={!town || loading}
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          {check ? 'Redraft the checklist' : 'Draft the lot checklist'}
        </button>
      </div>

      {!town && (
        <p className="text-base text-slate-600">Pick the town in the zoning card above first.</p>
      )}
      {error && <p className="text-base text-rose-700 font-semibold">{error}</p>}

      {check && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead>
                <tr className="text-sm text-slate-500 uppercase tracking-wide">
                  <th className="py-2 pr-4">Check</th>
                  <th className="py-2 pr-4">Your value</th>
                  <th className="py-2 pr-4">What to look for</th>
                  <th className="py-2">Where</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100 align-top">
                    <td className="py-3 pr-4 font-semibold text-slate-900">{row.label}</td>
                    <td className="py-3 pr-4">
                      <input
                        value={values[row.label] || ''}
                        onChange={(e) => setValues({ ...values, [row.label]: e.target.value })}
                        placeholder="from the ordinance"
                        className="w-40 px-3 py-2 border border-slate-300 rounded-lg"
                      />
                    </td>
                    <td className="py-3 pr-4 text-slate-700">{row.whatToLookFor}</td>
                    <td className="py-3 text-slate-700">
                      {row.whereToFindIt}
                      {town?.zoningUrl && (
                        <a
                          href={town.zoningUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline"
                        >
                          Ordinance <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {check.reforms.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-slate-900">Recent Rhode Island housing laws to check</h4>
              {check.reforms.map((r) => (
                <div key={r.title} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="font-bold text-slate-900">{r.title}</p>
                  <p className="text-slate-700">{r.whatItMeans}</p>
                  <p className="text-slate-600 italic">{r.howItCouldApply}</p>
                </div>
              ))}
            </div>
          )}

          <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-base font-bold text-amber-950">
              Drafted by Gemini. Fill in every value from the ordinance itself, and confirm with the town.
            </p>
          </div>
        </>
      )}
    </section>
  );
};
