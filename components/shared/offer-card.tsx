'use client';

interface OfferCardProps {
  programmeName: string;
  institutionName: string;
  onAccept?: () => void;
  onDecline?: () => void;
}

export function OfferCard({ programmeName, institutionName, onAccept, onDecline }: OfferCardProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-brand-700 to-brand-600 p-5 text-white">
      <div aria-hidden className="absolute -right-8 -bottom-12 size-32 rounded-full bg-white/[0.06]" />

      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/65 mb-2">
        Offer received
      </p>
      <p className="text-base font-semibold">{programmeName}</p>
      <p className="text-sm text-white/70 mt-0.5 mb-5">{institutionName}</p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="bg-white text-brand-700 font-semibold text-sm px-4 py-2 rounded-md hover:bg-brand-50 transition-colors"
        >
          Accept offer
        </button>
        <button
          type="button"
          onClick={onDecline}
          className="bg-white/15 text-white text-sm px-3.5 py-2 rounded-md hover:bg-white/25 transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
