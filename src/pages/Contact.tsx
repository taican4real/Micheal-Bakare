import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { BUDGET_RANGES, Service } from '../types';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, ArrowRight, Mail, MapPin, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

const CONTACT_FAQS = [
  {
    q: 'How far in advance should we inquire for film or theater scoring commissions?',
    a: 'For major feature films and theatrical productions, inquiries 3 to 6 months prior to picture lock or rehearsal start dates are ideal. However, expedited turnarounds can be evaluated based on current studio scheduling.',
  },
  {
    q: 'Can Michael travel for live conducting, podium direction, or masterclasses?',
    a: 'Yes. Michael conducts international masterclasses and conducts live orchestras across the UK, Europe, North America, and West Africa. Travel logistics and hospitality riders are handled through our administrative management.',
  },
  {
    q: 'Do you sign Non-Disclosure Agreements (NDAs) before reviewing scripts or rough cuts?',
    a: 'Absolutely. We routinely execute mutual NDAs prior to receiving unreleased screenplays, concept art, or rough video edits.',
  },
];

export default function Contact() {
  const location = useLocation();
  const easeCurve = [0.22, 1, 0.36, 1];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeServices, setActiveServices] = useState<Service[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organisation: '',
    service: location.state?.selectedService || '',
    projectDescription: '',
    preferredDate: '',
    budgetRange: '',
    location: '',
    additionalRequirements: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const q = query(collection(db, 'services'), where('status', '==', 'active'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
        if (data.length > 0) {
          setActiveServices(data);
        } else {
          setActiveServices([
            { id: '1', title: 'Film & Media Scoring', category: 'Composition', description: '', coverImageUrl: '', deliverables: [], requirements: [], faqs: [], seoTitle: '', seoDescription: '', status: 'active' },
            { id: '2', title: 'Orchestral Arranging & Direction', category: 'Arranging', description: '', coverImageUrl: '', deliverables: [], requirements: [], faqs: [], seoTitle: '', seoDescription: '', status: 'active' },
            { id: '3', title: 'Masterclasses & Academic Lectures', category: 'Academic', description: '', coverImageUrl: '', deliverables: [], requirements: [], faqs: [], seoTitle: '', seoDescription: '', status: 'active' },
            { id: '4', title: 'Executive Audio Branding', category: 'Creative Direction', description: '', coverImageUrl: '', deliverables: [], requirements: [], faqs: [], seoTitle: '', seoDescription: '', status: 'active' },
          ]);
        }
      } catch (error) {
        console.error("Failed to load services for dropdown", error);
      }
    };
    fetchServices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        setSubmitError("File size exceeds 10MB limit.");
        return;
      }
      setFile(selectedFile);
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    setUploadProgress(0);

    try {
      let fileUploadUrl = '';

      if (file) {
        const fileRef = ref(storage, `quotes/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);
        
        fileUploadUrl = await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(Math.round(progress));
            },
            (error) => reject(error),
            async () => {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            }
          );
        });
      }

      await addDoc(collection(db, 'quotes'), {
        ...formData,
        fileUploadUrl,
        status: 'NEW',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setSubmitSuccess(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full pb-32">
      <SEO
        title="Request a Proposal | Michael Bakare"
        description="Initiate a professional commission or inquiry with Michael Bakare for film scoring, orchestral arranging, and musical direction."
        url="/contact"
      />

      <section className="max-w-7xl mx-auto px-6 sm:px-12 pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Direct Info & Locations */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: easeCurve }}
              >
                <span className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-4 block">
                  Commissions & Engagements
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-ink mb-6">
                  Request a Formal Proposal.
                </h1>
                <p className="text-base md:text-lg text-ink-muted mb-8 font-light leading-relaxed">
                  Submit your project details to receive a customized engagement strategy and formal quotation.
                  Our administrative studio typically reviews and responds within 48 hours.
                </p>
              </motion.div>

              {/* Direct Offices */}
              <div className="space-y-6 pt-6 border-t border-border-subtle text-sm">
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-2 flex items-center gap-2">
                    <Mail size={14} /> Direct Executive Contact
                  </h3>
                  <a href="mailto:office@michaelbakare.com" className="text-base font-serif text-ink hover:text-ink-muted transition-colors font-medium">
                    office@michaelbakare.com
                  </a>
                </div>

                <div>
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-2 flex items-center gap-2">
                    <MapPin size={14} /> Primary Studios & Representation
                  </h3>
                  <div className="space-y-2 text-xs text-ink-muted font-light">
                    <p><strong className="text-ink font-medium">London HQ:</strong> Mayfair Studio & Archive, London, UK</p>
                    <p><strong className="text-ink font-medium">North America:</strong> Creative Sound Representation, New York & Los Angeles</p>
                    <p><strong className="text-ink font-medium">West Africa:</strong> Artistic Advisory & Production, Lagos, Nigeria</p>
                  </div>
                </div>

                <div className="p-4 bg-surface rounded-2xl border border-border-subtle text-xs text-ink-muted font-light flex items-center gap-3">
                  <ShieldCheck size={20} className="text-ink flex-shrink-0" />
                  <span>All submissions are treated with strict confidentiality. Mutual NDAs provided upon request.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-surface p-12 rounded-3xl border border-border-subtle text-center shadow-sm"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="font-serif text-3xl text-ink mb-4">Proposal Request Received</h2>
                  <p className="text-ink-muted font-light leading-relaxed mb-8 max-w-md mx-auto">
                    Thank you for reaching out. Your project brief has been logged into Michael Bakare’s executive portal.
                    We will review the materials and reply with formal parameters shortly.
                  </p>
                  <button 
                    onClick={() => {
                      setSubmitSuccess(false);
                      setFormData({
                        name: '', email: '', phone: '', organisation: '', service: '',
                        projectDescription: '', preferredDate: '', budgetRange: '', location: '', additionalRequirements: ''
                      });
                      setFile(null);
                    }}
                    className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-wider font-semibold bg-ink text-canvas px-8 py-4 rounded-full hover:bg-zinc-800 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: easeCurve }}
                  onSubmit={handleSubmit} 
                  className="bg-surface/60 border border-border-subtle p-8 sm:p-12 rounded-3xl space-y-8 shadow-sm"
                >
                  {submitError && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex gap-3 text-sm border border-red-100">
                      <AlertCircle size={20} className="flex-shrink-0" />
                      <p>{submitError}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Full Name *</label>
                      <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink" placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Email Address *</label>
                      <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink" placeholder="jane@studio.com" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink" placeholder="+44 (0) 20 7946 0912" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Organization / Production Company</label>
                      <input name="organisation" value={formData.organisation} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink" placeholder="Horizon Pictures Ltd" />
                    </div>
                  </div>

                  <hr className="border-border-subtle" />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Requested Service *</label>
                      <select required name="service" value={formData.service} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink cursor-pointer">
                        <option value="" disabled>Select a service category</option>
                        {activeServices.map(s => (
                          <option key={s.id} value={s.title}>{s.title}</option>
                        ))}
                        <option value="Other">Other Custom Commission</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Estimated Budget Range</label>
                      <select name="budgetRange" value={formData.budgetRange} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink cursor-pointer">
                        <option value="" disabled>Select approximate range</option>
                        {BUDGET_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Target Timeline / Delivery</label>
                      <input name="preferredDate" value={formData.preferredDate} onChange={handleInputChange} placeholder="e.g. Q4 2026 or Spring 2027" className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Production Location</label>
                      <input name="location" value={formData.location} onChange={handleInputChange} placeholder="e.g. London / Remote / Los Angeles" className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Project Overview & Narrative Goals *</label>
                    <textarea required name="projectDescription" rows={5} value={formData.projectDescription} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink resize-none" placeholder="Provide an overview of the story, musical tone, intended instrumentation, and key deadlines..." />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Supporting Brief or Lookbook (Optional)</label>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.zip,.txt" />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-4 py-6 border-2 border-dashed border-border-subtle rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-ink hover:bg-canvas transition-colors"
                    >
                      <UploadCloud size={24} className="text-ink-muted mb-2" />
                      <p className="text-sm font-medium text-ink mb-1">{file ? file.name : 'Click to Upload Project Brief or Temp Track'}</p>
                      <p className="text-xs text-ink-muted">PDF, DOC, ZIP (Max 10MB)</p>
                    </div>
                    {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-ink h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-ink mb-2">Technical Constraints / Confidentiality Notes</label>
                    <textarea name="additionalRequirements" rows={3} value={formData.additionalRequirements} onChange={handleInputChange} className="w-full px-4 py-3.5 bg-canvas border border-border-subtle rounded-xl focus:border-ink outline-none text-sm text-ink resize-none" placeholder="Any specific stem formats, Dolby Atmos requirements, or NDA procedures..." />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-between bg-ink text-canvas px-8 py-5 rounded-2xl font-medium text-sm uppercase tracking-wider hover:bg-zinc-800 transition-colors disabled:opacity-70 group shadow-md"
                    >
                      <span>{isSubmitting ? 'Transmitting Proposal Brief...' : 'Transmit Proposal Brief'}</span>
                      {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />}
                    </button>
                    <p className="text-[11px] text-ink-muted text-center mt-4 font-light">
                      Protected by 256-bit encrypted transport. All details are kept strictly confidential.
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* FAQs for Commissions */}
        <div className="mt-32 pt-20 border-t border-border-subtle">
          <div className="max-w-3xl mb-12">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-ink-muted mb-3 flex items-center gap-2">
              <HelpCircle size={14} /> Commissioning Guidelines
            </h2>
            <h3 className="font-serif text-3xl text-ink">Frequently Asked Questions</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {CONTACT_FAQS.map((faq, idx) => (
              <div key={idx} className="bg-surface p-6 rounded-2xl border border-border-subtle">
                <h4 className="font-serif text-base text-ink font-medium mb-3">{faq.q}</h4>
                <p className="text-xs text-ink-muted font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
