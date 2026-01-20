import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { User, Phone, Mail, MapPin, Calendar, Shield, CheckCircle, Loader2, Upload, LogOut, Edit2, Save, X, Lock, ShieldCheck } from 'lucide-react';

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    location: 'Mumbai, Maharashtra',
    dob: '15 August 1990',
    memberSince: 'January 2024'
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
    const type = docName === 'Phone Number' ? 'phone' : 'email';
    const target = verifyContactInputs[docName];

    if (!target) {
      alert("Please enter a valid value");
      return;
    }

    setVerificationStatus(prev => ({ ...prev, [docName]: 'sending_otp' }));

    try {
      const response = await fetch('http://localhost:8000/api/send_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, type }),
      });

      if (response.ok) {
        setOtpSent(prev => ({ ...prev, [docName]: true }));
        setVerificationStatus(prev => ({ ...prev, [docName]: 'otp_sent' }));
        alert(`OTP sent to ${target} (Use 123456 for demo)`);
      } else {
        alert('Failed to send OTP');
        setVerificationStatus(prev => ({ ...prev, [docName]: 'entering_contact' }));
      }
    } catch (e) {
      console.error(e);
      alert('Error sending OTP');
      setVerificationStatus(prev => ({ ...prev, [docName]: 'entering_contact' }));
    }
  };

  const handleVerifyOtp = async (docName: string) => {
    const type = docName === 'Phone Number' ? 'phone' : 'email';
    const target = verifyContactInputs[docName];
    const otp = otpInputs[docName];

    setVerificationStatus(prev => ({ ...prev, [docName]: 'verifying' }));

    try {
      const response = await fetch('http://localhost:8000/api/verify_otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, type, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationStatus(prev => ({ ...prev, [docName]: 'verified' }));
        setOtpSent(prev => ({ ...prev, [docName]: false }));
        // Update main profile if verified
        setProfile(prev => ({
          ...prev,
          [type]: target
        }));
        alert('Verification Successful!');
      } else {
        alert('Invalid OTP. Please try again.');
        setVerificationStatus(prev => ({ ...prev, [docName]: 'otp_sent' }));
      }
    } catch (e) {
      console.error(e);
      alert('Verification failed');
      setVerificationStatus(prev => ({ ...prev, [docName]: 'otp_sent' }));
    }
  };

  const handleDocUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && uploadingDoc) {
      setVerificationStatus(prev => ({ ...prev, [uploadingDoc]: 'verifying' }));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('doc_type', uploadingDoc);

      try {
        const response = await fetch('http://localhost:8000/api/verify_document', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setVerificationStatus(prev => ({ ...prev, [uploadingDoc]: 'verified' }));
          alert(data.message);
        } else {
          setVerificationStatus(prev => ({ ...prev, [uploadingDoc]: 'unverified' }));
          alert("Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setVerificationStatus(prev => ({ ...prev, [uploadingDoc]: 'unverified' }));
        alert("Verification error. Check backend connection.");
      }

      setUploadingDoc(null);
      if (docInputRef.current) docInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile Updated Successfully!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-white" />;
      case 'verifying': return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-4xl font-black text-gray-900 mb-2 heading-display">Your Profile</h1>
          <p className="text-gray-600 text-lg">Manage your personal information and verification status</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Info */}
          <div className="lg:col-span-2 space-y-8 animate-fade-in-up">
            {/* Profile Header Card */}
            <Card className="p-8 bg-white rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full -mr-20 -mt-20 opacity-50"></div>

              <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#0A1F44] to-[#2a4a6f] rounded-full flex items-center justify-center shadow-xl ring-4 ring-white">
                    <span className="text-4xl font-bold text-white tracking-widest">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 heading-primary">{profile.name}</h2>
                      <p className="text-gray-500 font-medium">Gig Worker • {profile.location}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="px-4 py-1.5 bg-green-50 text-green-700 text-sm font-bold rounded-full border border-green-100 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Identity Verified
                    </span>
                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 text-sm font-bold rounded-full border border-blue-100 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Since {profile.memberSince}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4">
                <Button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${isEditing
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-[#0A1F44] hover:bg-[#152c57] text-white'
                    }`}
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  {isEditing ? 'Save Changes' : 'Edit Profile'}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 rounded-xl font-bold border-gray-300 hover:bg-gray-50 text-gray-600"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                )}
                <Button
                  variant="destructive"
                  className="ml-auto px-6 py-2.5 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 shadow-none"
                  onClick={() => alert("Firebase Sign Out Logic would be triggered here.")}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            </Card>

            {/* Details Form */}
            <Card className="p-8 bg-white rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                      <Phone className="w-4 h-4 text-blue-500" /> Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg font-bold text-gray-900 pl-1">{profile.phone}</p>
                    )}
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                      <Mail className="w-4 h-4 text-blue-500" /> Email Address
                    </label>
                    {isEditing ? (
                      <input
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg font-bold text-gray-900 pl-1">{profile.email}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                      <MapPin className="w-4 h-4 text-blue-500" /> Location
                    </label>
                    {isEditing ? (
                      <input
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg font-bold text-gray-900 pl-1">{profile.location}</p>
                    )}
                  </div>
                  <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                      <Calendar className="w-4 h-4 text-blue-500" /> Date of Birth
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-gray-900"
                        value={profile.dob} // Needs proper date format for input type=date usually, keeping simple for demo
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg font-bold text-gray-900 pl-1">{profile.dob}</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Verification */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="p-0 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
              <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Verification Center</h3>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                </div>
                <input
                  type="file"
                  ref={docInputRef}
                  className="hidden"
                  onChange={handleDocUpload}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <div className="p-6 space-y-4 flex-1">
                {Object.entries(verificationStatus).map(([docName, status]) => (
                  <div
                    key={docName}
                    className={`p-4 rounded-xl border transition-all ${status === 'verified' ? 'bg-green-50/50 border-green-100' :
                      status === 'verifying' ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${status === 'verified' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                          {status === 'verified' ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </div>
                        <span className={`font-bold text-sm ${status === 'verified' ? 'text-green-800' : 'text-gray-700'}`}>
                          {docName}
                        </span>
                      </div>
                      {status === 'verified' && (
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-md">VERIFIED</span>
                      )}
                    </div>

                    {status === 'verifying' && (
                      <div className="flex items-center gap-2 text-blue-600 text-sm font-medium animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin" /> Verifying Document...
                      </div>
                    )}

                    {status === 'unverified' && (
                      <Button
                        size="sm"
                        className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-black hover:text-white hover:border-transparent transition-all font-semibold rounded-lg text-xs h-9"
                        onClick={() => handleVerifyClick(docName)}
                      >
                        <Upload className="w-3 h-3 mr-2" />
                        {docName === 'Phone Number' || docName === 'Email Address' ? 'Verify via OTP' : 'Upload Document'}
                      </Button>
                    )}

                    {status === 'entering_contact' && (
                      <div className="mt-2 space-y-2">
                        <input
                          type={docName === 'Email Address' ? 'email' : 'text'}
                          className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          value={verifyContactInputs[docName] || ''}
                          onChange={(e) => setVerifyContactInputs({ ...verifyContactInputs, [docName]: e.target.value })}
                          placeholder={docName === 'Email Address' ? 'Enter Email' : 'Enter Phone'}
                        />
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg h-9"
                          onClick={() => handleSendOtp(docName)}
                        >
                          Send OTP
                        </Button>
                      </div>
                    )}

                    {status === 'otp_sent' && (
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter OTP"
                            className="flex-1 text-sm p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-center tracking-widest font-mono"
                            value={otpInputs[docName] || ''}
                            onChange={(e) => setOtpInputs({ ...otpInputs, [docName]: e.target.value })}
                          />
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg px-4"
                            onClick={() => handleVerifyOtp(docName)}
                          >
                            Check
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 text-center">Enter 123456 for demo</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-[#0A1F44] to-[#1e3a5f] text-white rounded-3xl shadow-lg border-0 relative overflow-hidden">
              <div className="relative z-10 flex items-start gap-4">
                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                  <Shield className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Secure & Private</h3>
                  <p className="text-sm text-blue-100 leading-relaxed opacity-90">
                    Your data is protected with bank-grade encryption. We strictly strictly adhere to Indian data privacy laws.
                  </p>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full -ml-12 -mb-12"></div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
