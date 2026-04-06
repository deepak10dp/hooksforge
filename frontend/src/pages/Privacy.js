import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50" data-testid="privacy-page">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-700 font-bold mb-6 hover:text-slate-900 transition-colors"
          data-testid="back-button"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={3} />
          Back to Home
        </button>

        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-sm p-8">
          <h1 className="text-4xl font-black text-slate-900 mb-6">Privacy Policy</h1>

          <div className="space-y-6 text-slate-700">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Data Collection</h2>
              <p className="font-semibold">
                HookForge does not collect, store, or transmit any personal data to external servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Local Storage</h2>
              <p className="font-semibold">
                All data including your usage count, generation history, and preferences are stored
                locally in your browser using localStorage. This data never leaves your device.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">No Tracking</h2>
              <p className="font-semibold">
                We do not use any analytics, tracking pixels, or third-party cookies to monitor your
                activity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">AI Processing</h2>
              <p className="font-semibold">
                Your topic inputs are sent to our AI service solely for generating hooks, captions,
                and video ideas. We do not store or log these inputs beyond the immediate generation
                request.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Your Control</h2>
              <p className="font-semibold">
                You can clear all local data at any time by clearing your browser's localStorage or
                cache for this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Changes to Policy</h2>
              <p className="font-semibold">
                Any updates to this privacy policy will be posted on this page.
              </p>
            </section>

            <section className="border-t-2 border-slate-200 pt-6 mt-8">
              <p className="font-semibold text-sm text-slate-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;