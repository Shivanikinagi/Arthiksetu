import { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { User, Phone, Mail, MapPin, Calendar, Shield, CheckCircle, Loader2, Upload } from 'lucide-react';

export function ProfilePage() {
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
  const docInputRef = useRef<HTMLInputElement>(null);

  const handleVerifyClick = (docName: string) => {
    if (docName === 'Phone Number' || docName === 'Email Address') {
      setVerificationStatus(prev => ({ ...prev, [docName]: 'verifying' }));

      // Simulate OTP Verification
      setTimeout(() => {
        setVerificationStatus(prev => ({ ...prev, [docName]: 'verified' }));
        alert(`${docName} verified successfully via OTP!`);
      }, 2000);
      return;
    }

    setUploadingDoc(docName);
    docInputRef.current?.click();
  };

  const handleDocUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && uploadingDoc) {
      // Set status to verifying
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-[#0A1F44] mb-2">Your Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and verification status
        </p>
      </div>

      <Card className="p-6 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-[#0A1F44] to-[#1a3a6b] rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-[#0A1F44]">Rajesh Kumar</h2>
              <span className="px-3 py-1 bg-[#1E7F5C] text-white text-sm rounded-full flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Verified
              </span>
            </div>
            <p className="text-gray-600 mb-4">Member since January 2024</p>
            <div className="flex gap-2">
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`${isEditing ? 'bg-[#1E7F5C] hover:bg-[#16654a]' : 'bg-[#F7931E] hover:bg-[#e07d0a]'} text-white border-0`}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={() => alert("Firebase Sign Out Logic would be triggered here.")}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#3B82F6] mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-[#0A1F44]"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-[#0A1F44]">{profile.phone}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#3B82F6] mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-[#0A1F44]"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                ) : (
                  <p className="text-[#0A1F44]">{profile.email}</p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#3B82F6] mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Location</p>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-[#0A1F44]"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                ) : (
                  <p className="text-[#0A1F44]">{profile.location}</p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#3B82F6] mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-[#0A1F44]"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  />
                ) : (
                  <p className="text-[#0A1F44]">{profile.dob}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#0A1F44]">Verification Status</h3>
          <input
            type="file"
            ref={docInputRef}
            className="hidden"
            onChange={handleDocUpload}
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
          />
        </div>

        <div className="space-y-4">
          {Object.entries(verificationStatus).map(([docName, status]) => (
            <div
              key={docName}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Shield className={`w-5 h-5 ${status === 'verified' ? 'text-[#1E7F5C]' : 'text-gray-400'}`} />
                <span className="text-[#0A1F44]">{docName}</span>
              </div>

              {status === 'verified' && (
                <span className="px-3 py-1 bg-[#1E7F5C] text-white text-sm rounded-full flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Verified
                </span>
              )}

              {status === 'verifying' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </span>
              )}

              {status === 'unverified' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#F7931E] text-[#F7931E] hover:bg-[#F7931E] hover:text-white"
                  onClick={() => handleVerifyClick(docName)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Verify Now
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-[#0A1F44] to-[#1a3a6b] text-white">
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
          <div>
            <h3 className="mb-2">Data Privacy & Security</h3>
            <p className="text-sm opacity-90">
              Your personal information is encrypted and stored securely. We never share your data
              without your explicit consent. All data handling complies with Indian data protection regulations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
