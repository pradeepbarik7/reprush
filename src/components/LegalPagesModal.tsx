import React from 'react';
import { LegalDocType } from '../types';
import { X, ShieldCheck, FileText, HeartPulse, Users, Cookie, Building2, Mail } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface LegalPagesModalProps {
  isOpen: boolean;
  docType: LegalDocType;
  onClose: () => void;
  onSelectDoc: (doc: LegalDocType) => void;
}

export const LegalPagesModal: React.FC<LegalPagesModalProps> = ({
  isOpen,
  docType,
  onClose,
  onSelectDoc,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm select-none animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="font-extrabold text-sm uppercase tracking-wider text-gray-900 font-mono">
              RepRush Legal & Information
            </span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation for Quick Switching */}
        <div className="px-6 py-2.5 border-b border-gray-100 bg-white flex items-center gap-2 overflow-x-auto text-xs font-semibold shrink-0">
          <button
            onClick={() => {
              playClickSound();
              onSelectDoc('privacy');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              docType === 'privacy' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => {
              playClickSound();
              onSelectDoc('terms');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              docType === 'terms' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Terms of Use
          </button>
          <button
            onClick={() => {
              playClickSound();
              onSelectDoc('responsible-play');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              docType === 'responsible-play' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Responsible Play
          </button>
          <button
            onClick={() => {
              playClickSound();
              onSelectDoc('community');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              docType === 'community' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Community Guidelines
          </button>
          <button
            onClick={() => {
              playClickSound();
              onSelectDoc('cookies');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              docType === 'cookies' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Cookie Policy
          </button>
          <button
            onClick={() => {
              playClickSound();
              onSelectDoc('about-aitia');
            }}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
              docType === 'about-aitia' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            About Aitia Media
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-gray-700 text-sm leading-relaxed space-y-6">
          {docType === 'privacy' && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-gray-950">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h2 className="text-2xl font-extrabold tracking-tight">Privacy Policy</h2>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-mono">Last Updated: September 2026 • Prototype Edition</p>

              <div className="space-y-4">
                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">1. Information We Collect</h3>
                  <p>
                    RepRush collects minimal pseudonymous profile information such as your chosen player nickname, division rating, and match history stored in your local browser storage.
                  </p>
                </section>

                <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-950">
                  <h3 className="text-base font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    2. Camera Permissions & Local Pose Detection
                  </h3>
                  <p className="font-medium text-emerald-900 leading-relaxed">
                    RepRush uses camera access to detect body movement and count exercise repetitions. Camera processing is intended to occur locally on the user's device. RepRush does not need to upload or store raw camera footage for the core rep-counting experience.
                  </p>
                  <p className="text-xs text-emerald-800 mt-2">
                    Keypoint landmark coordinates are processed instantaneously in volatile device memory via WebAssembly/WebGL models and are never permanently recorded or streamed to remote servers.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">3. Simulated Wallet & Demo Balance</h3>
                  <p>
                    All wallet balances, entry stakes, and reward counters stored in this prototype are virtual demo simulations recorded exclusively in your browser's local storage. RepRush does not collect banking information, credit card numbers, or government tax identifiers.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">4. Third-Party Services & Children's Privacy</h3>
                  <p>
                    MediaPipe vision runtime models are loaded over secure CDNs. RepRush is designed for users capable of safe physical exercise and does not knowingly collect personal data from children under 13.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">5. Contact Information</h3>
                  <p>
                    For inquiries regarding privacy, please contact the product team at Aitia Media: <span className="font-mono text-gray-900">Contact details coming soon.</span>
                  </p>
                </section>
              </div>
            </div>
          )}

          {docType === 'terms' && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-gray-950">
                <FileText className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-extrabold tracking-tight">Terms of Use</h2>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-mono">Last Updated: September 2026 • Prototype Edition</p>

              <div className="space-y-4">
                <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-950">
                  <h3 className="text-base font-bold text-amber-900 mb-1">
                    1. Non-Monetary Prototype & Simulated Balances
                  </h3>
                  <p className="font-medium text-amber-900 leading-relaxed">
                    IMPORTANT NOTICE: The current wallet, stakes, and rewards shown in this prototype are simulated and have no cash value. No real money can be deposited, wagered, or withdrawn. The service is strictly a demonstration prototype.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">2. Eligibility & Safe Participation</h3>
                  <p>
                    By using RepRush, you represent that you are in good physical health and medically cleared to engage in physical calisthenics exercises. You agree to exercise responsibly and within your personal physical threshold.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">3. Automated Push-Up Detection Limitations</h3>
                  <p>
                    Computer vision rep detection relies on camera placement, lighting, and body orientation. Detection is automated and intended for recreational gaming; RepRush does not warrant certified Olympic or Guinness-standard motion analysis.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">4. Intellectual Property</h3>
                  <p>
                    RepRush, its graphic logos, battle mechanics, algorithms, and interface designs are proprietary product prototypes developed by Aitia Media.
                  </p>
                </section>
              </div>
            </div>
          )}

          {docType === 'responsible-play' && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-gray-950">
                <HeartPulse className="w-6 h-6 text-rose-600" />
                <h2 className="text-2xl font-extrabold tracking-tight">Responsible Play</h2>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-mono">Physical Health & Wellness Policy</p>

              <div className="space-y-4">
                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">1. Competitive Fitness Guidelines</h3>
                  <p>
                    RepRush should be treated as a competitive fitness gaming experience. Always warm up your shoulders, wrists, and core before starting high-intensity matches.
                  </p>
                </section>

                <section className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-950">
                  <h3 className="text-base font-bold text-rose-900 mb-1">2. Stop If You Experience Pain</h3>
                  <p className="font-medium text-rose-900">
                    Do not exercise beyond your physical ability. Stop immediately if you experience sharp joint pain, dizziness, shortness of breath, or unusual cardiovascular symptoms.
                  </p>
                  <p className="text-xs text-rose-800 mt-2">
                    RepRush does not provide medical advice or diagnosis. Consult a qualified physician before starting any strenuous exercise program.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">3. No Real-Money Gaming</h3>
                  <p>
                    Demo balances have no monetary value. The prototype does not enable real-money gaming, gambling, or betting. Enjoy the competition as physical athletic self-improvement.
                  </p>
                </section>
              </div>
            </div>
          )}

          {docType === 'community' && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-gray-950">
                <Users className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-extrabold tracking-tight">Community Guidelines</h2>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-mono">Fair Play & Sportsmanship Code</p>

              <div className="space-y-4">
                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">1. Fair Play & Integrity</h3>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Perform full range-of-motion repetitions with strict elbow lockout and chest depth.</li>
                    <li>No manipulated camera feeds, pre-recorded loops, or spoofed webcam software.</li>
                    <li>No automated bots, script injectors, or exploiting software bugs.</li>
                    <li>No offensive, defamatory, or abusive player handles.</li>
                  </ul>
                </section>

                <section className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-950">
                  <h3 className="text-base font-bold text-blue-900 mb-1">2. Automated Anti-Cheat Detection</h3>
                  <p className="font-medium text-blue-900">
                    For the future multiplayer system, RepRush may use automated systems and review mechanisms to detect suspicious gameplay, unnatural repetition velocities, or invalid body geometries.
                  </p>
                </section>
              </div>
            </div>
          )}

          {docType === 'cookies' && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-gray-950">
                <Cookie className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-extrabold tracking-tight">Cookie Policy</h2>
              </div>
              <p className="text-xs text-gray-500 mb-6 font-mono">Local Storage & Session Usage</p>

              <div className="space-y-4">
                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">1. Essential Local Storage</h3>
                  <p>
                    RepRush uses your browser's <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">localStorage</code> to maintain demo wallet balances, transaction records, sound preferences, and tournament progress. This data stays exclusively in your local browser sandbox.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">2. Controlling Your Storage</h3>
                  <p>
                    You can clear your local demo balance and match history anytime by clearing your browser cache or using the "Reset Demo Balance" button inside the Wallet view.
                  </p>
                </section>
              </div>
            </div>
          )}

          {docType === 'about-aitia' && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-gray-950">
                <Building2 className="w-6 h-6 text-gray-900" />
                <h2 className="text-2xl font-extrabold tracking-tight">Aitia Media</h2>
              </div>
              <p className="text-base font-semibold text-gray-700 italic mb-6">
                "Built for brands, products and digital experiences."
              </p>

              <div className="space-y-4">
                <section className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
                  <h3 className="text-base font-bold text-gray-950 mb-2">About RepRush</h3>
                  <p className="leading-relaxed">
                    RepRush is a product prototype developed by Aitia Media exploring real-time computer vision, competitive sports psychology, and gamified athletic calisthenics.
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-bold text-gray-950 mb-1">Get in Touch</h3>
                  <p className="text-gray-600">
                    Contact details coming soon.
                  </p>
                </section>
              </div>
            </div>
          )}

          {docType === 'contact' && (
            <div>
              <div className="flex items-center gap-2 mb-4 text-gray-950">
                <Mail className="w-6 h-6 text-gray-900" />
                <h2 className="text-2xl font-extrabold tracking-tight">Contact</h2>
              </div>
              <p className="text-sm text-gray-600 mb-6">Inquiries regarding the RepRush prototype:</p>
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                <p className="text-sm font-semibold text-gray-700">Contact details coming soon.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-gray-500 font-mono">
            RepRush is developed by Aitia Media.
          </span>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
