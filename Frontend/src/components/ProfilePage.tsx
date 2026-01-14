import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { User, Phone, Mail, MapPin, Calendar, Shield, CheckCircle, Loader2, Upload, Globe, Settings, Menu } from 'lucide-react';

// Extend window interface for Google Translate
declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

interface ProfilePageProps {
  onToggleSidebar?: () => void;
}

export function ProfilePage({ onToggleSidebar }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    location: 'Mumbai, Maharashtra',
    dob: '15 August 1990'
  });

  const [verificationStatus, setVerificationStatus] = useState<Record<string, string>>({
    'Aadhaar': 'unverified',
    'PAN Card': 'unverified',
    'Bank Account': 'unverified',
    'Phone Number': 'unverified',
    'Email Address': 'unverified',
  });

  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<{ [key: string]: boolean }>({});
  const [otpInputs, setOtpInputs] = useState<{ [key: string]: string }>({});
  const [verifyContactInputs, setVerifyContactInputs] = useState<{ [key: string]: string }>({});
  const docInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        const element = document.getElementById('google_translate_element');
        if (element) element.innerHTML = '';
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element'
        );
      }
    };

    if (window.google && window.google.translate) {
      initGoogleTranslate();
    } else {
      window.googleTranslateElementInit = initGoogleTranslate;
    }
  }, []);

  const handleVerifyClick = async (docName: string) => {
    if (docName === 'Phone Number' || docName === 'Email Address') {
      const type = docName === 'Phone Number' ? 'phone' : 'email';
      const defaultValue = type === 'phone' ? profile.phone : profile.email;
      setVerifyContactInputs(prev => ({ ...prev, [docName]: defaultValue }));
      setVerificationStatus(prev => ({ ...prev, [docName]: 'entering_contact' }));
      return;
    }
    setUploadingDoc(docName);
    docInputRef.current?.click();
  };

  const handleSendOtp = async (docName: string) => {
    // ... OTP Logic same as before
    const type = docName === 'Phone Number' ? 'phone' : 'email';
    const target = verifyContactInputs[docName];
    if (!target) { alert("Please enter a valid value"); return; }
    setVerificationStatus(prev => ({ ...prev, [docName]: 'sending_otp' }));
    // Mock success for UI stability if backend fails
    setTimeout(() => {
      setOtpSent(prev => ({ ...prev, [docName]: true }));
      setVerificationStatus(prev => ({ ...prev, [docName]: 'otp_sent' }));
      alert(`OTP sent to ${target} (Use 123456 for demo)`);
    }, 500);
  };

  const handleVerifyOtp = async (docName: string) => {
    // Mock verify
    setVerificationStatus(prev => ({ ...prev, [docName]: 'verifying' }));
    setTimeout(() => {
      setVerificationStatus(prev => ({ ...prev, [docName]: 'verified' }));
      setOtpSent(prev => ({ ...prev, [docName]: false }));
      alert('Verification Successful!');
    }, 1000);
  };

  const handleDocUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // Mock upload
    const file = event.target.files?.[0];
    if (file && uploadingDoc) {
      setVerificationStatus(prev => ({ ...prev, [uploadingDoc]: 'verifying' }));
      setTimeout(() => {
        setVerificationStatus(prev => ({ ...prev, [uploadingDoc]: 'verified' }));
        alert("Document verified successfully!");
      }, 1500);
      setUploadingDoc(null);
      if (docInputRef.current) docInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile Updated Successfully!");
  };

  return (
    <div className="bg-[#0A1F44] min-h-screen font-sans">

      {/* Simple Header with Menu */}
      <div className="px-6 pt-12 pb-8 text-white flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-xl font-bold">Profile</h1>
      </div>

      {/* Content Sheet */}
      <div className="bg-[#F8F9FA] rounded-t-[32px] px-6 pt-8 pb-32 min-h-[calc(100vh-100px)] animate-in slide-in-from-bottom-10 duration-500">

        <div className="flex flex-col items-center mb-8 -mt-16">
          <div className="w-24 h-24 bg-white p-1 rounded-full shadow-lg">
            <div className="w-full h-full bg-[#0A1F44] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              RK
            </div>
          </div>
          <h2 className="text-[#0A1F44] font-bold text-lg mt-3">Rajesh Kumar</h2>
          <div className="flex items-center gap-1 mt-1">
            <CheckCircle className="w-4 h-4 text-[#1E7F5C]" />
            <p className="text-sm text-gray-500">Verified Member</p>
          </div>
        </div>

        {/* Preferences / Settings */}
        <Card className="p-6 bg-white rounded-[24px] shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
            <Settings className="w-5 h-5 text-[#3B82F6]" />
            <h3 className="font-bold text-[#0A1F44]">App Settings</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0A1F44]">App Language</p>
                  <p className="text-xs text-gray-500">Select your preferred language</p>
                </div>
              </div>
              <div id="google_translate_element" className="scale-90 origin-right"></div>
            </div>
          </div>
        </Card>

        {/* Profile Info Cards */}
        <div className="space-y-4">
          <Card className="p-5 bg-white rounded-[24px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#0A1F44]">Personal Details</h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="text-[#F7931E]"
              >
                {isEditing ? 'Save' : 'Edit'}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <input className="border rounded px-2 py-1 text-sm" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                ) : <p className="text-sm text-gray-600">{profile.phone}</p>}
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <input className="border rounded px-2 py-1 text-sm" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                ) : <p className="text-sm text-gray-600">{profile.email}</p>}
              </div>
            </div>
          </Card>

          {/* Verification Status (Condensed) */}
          <Card className="p-5 bg-white rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#0A1F44] mb-4">Verification</h3>
            <div className="space-y-3">
              {Object.entries(verificationStatus).map(([docName, status]) => (
                <div key={docName} className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">{docName}</p>
                  {status === 'verified' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {status === 'unverified' && (
                    <button
                      className="text-xs text-[#F7931E] font-medium"
                      onClick={() => handleVerifyClick(docName)}
                    >
                      Verify
                    </button>
                  )}
                  <input type="file" ref={docInputRef} className="hidden" onChange={handleDocUpload} accept=".pdf,.jpg" />
                </div>
              ))}
            </div>
          </Card>

          <Button
            variant="outline"
            className="w-full border-red-200 text-red-500 hover:bg-red-50 rounded-2xl h-12"
            onClick={() => alert("Logged Out")}
          >
            Log Out
          </Button>
        </div>

      </div>
    </div>
  );
}
