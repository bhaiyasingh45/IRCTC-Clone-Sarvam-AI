import { STATIONS } from '../../data/trains.js';
import { useLanguage } from '../../i18n/LanguageContext.jsx';
import { stationLabel, classLabel, genderLabel, formatDate } from '../../i18n/helpers.js';

export default function ReviewScreen({ state, dispatch }) {
  const { t, lang } = useLanguage();
  const { selectedTrain, selectedClass, passengers, contactNumber, totalFare, searchParams } = state;

  if (!selectedTrain) {
    dispatch({ type: 'NAVIGATE', screen: 'home' });
    return null;
  }

  const srcStation = STATIONS[selectedTrain.source];
  const dstStation = STATIONS[selectedTrain.destination];
  const classInfo = selectedTrain.classes[selectedClass];
  const paxCount = passengers.length;
  const baseFare = (classInfo?.fare || 0) * paxCount;
  const reservation = 60 * paxCount;
  const gst = Math.round(baseFare * 0.05);
  const computedTotal = baseFare + reservation + gst;
  const displayTotal = totalFare || computedTotal;

  const handleConfirm = () => {
    const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    dispatch({ type: 'SET_PNR', pnr });
    dispatch({ type: 'PUSH_HISTORY' });
    dispatch({ type: 'NAVIGATE', screen: 'payment' });
  };

  const handleCancel = () => {
    if (state.screenHistory.length > 0) {
      dispatch({ type: 'POP_HISTORY' });
    } else {
      dispatch({ type: 'RESET' });
    }
  };

  const journeyDate = searchParams.date ? formatDate(lang, searchParams.date) : t('review.na');

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      {/* Warning header */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 mb-5 flex items-center gap-3">
        <span className="text-2xl">⚠️</span>
        <div>
          <h1 className="font-bold text-amber-800 text-lg">{t('review.title')}</h1>
          <p className="text-amber-700 text-sm">{t('review.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Journey details */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h2 className="text-navy font-bold text-sm uppercase tracking-wide mb-3 pb-2 border-b border-slate-100">{t('review.journey')}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.train')}</dt>
              <dd className="font-semibold text-navy text-right">{selectedTrain.train_number} · {selectedTrain.train_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.from')}</dt>
              <dd className="font-medium">{stationLabel(t, srcStation?.code)} ({srcStation?.code})</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.to')}</dt>
              <dd className="font-medium">{stationLabel(t, dstStation?.code)} ({dstStation?.code})</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.date')}</dt>
              <dd className="font-medium">{journeyDate}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.class')}</dt>
              <dd className="font-medium">{selectedClass} ({classLabel(t, selectedClass)})</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.quota')}</dt>
              <dd className="font-medium">{t('review.quotaGeneral')}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.contact')}</dt>
              <dd className="font-medium">{contactNumber}</dd>
            </div>
          </dl>
        </div>

        {/* Fare summary */}
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <h2 className="text-navy font-bold text-sm uppercase tracking-wide mb-3 pb-2 border-b border-slate-100">{t('review.fareSummary')}</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.baseFare', { n: paxCount })}</dt>
              <dd className="font-medium">₹{classInfo?.fare || 0} × {paxCount} = ₹{baseFare}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.reservation')}</dt>
              <dd className="font-medium">₹{reservation}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t('review.gst')}</dt>
              <dd className="font-medium">₹{gst}</dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 mt-2">
              <dt className="font-bold text-navy text-base">{t('review.total')}</dt>
              <dd className="font-bold text-navy text-base">₹{displayTotal}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Passengers */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 mb-4">
        <h2 className="text-navy font-bold text-sm uppercase tracking-wide mb-3">{t('review.passengers')}</h2>
        <div className="space-y-2">
          {passengers.map((p, i) => (
            <div key={i} className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded">
              <span className="font-medium text-navy">{i + 1}. {p.name}</span>
              <span className="text-slate-500">{t('form.paxLine', { age: p.age, gender: genderLabel(t, p.gender), berth: t(`form.berth.${p.berth}`) })}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Voice hint */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5 text-center">
        <span className="text-blue-700 text-sm">
          {t('review.voiceHint')}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleCancel}
          className="h-11 px-6 border-2 border-red-300 text-red-600 hover:bg-red-50 rounded font-medium text-sm transition-colors"
        >
          {t('review.cancel')}
        </button>
        <button
          onClick={handleConfirm}
          className="h-11 px-8 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition-colors"
        >
          {t('review.confirm')}
        </button>
      </div>
    </div>
  );
}
