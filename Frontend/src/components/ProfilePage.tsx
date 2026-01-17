import { Card } from './ui/card';
import { Button } from './ui/button';
import { User, Phone, Mail, MapPin, Calendar, Shield, CheckCircle } from 'lucide-react';

export function ProfilePage() {
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
            <Button className="bg-[#F7931E] hover:bg-[#e07d0a] text-white border-0">
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#3B82F6] mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                <p className="text-[#0A1F44]">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#3B82F6] mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-[#0A1F44]">rajesh.kumar@email.com</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#3B82F6] mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-[#0A1F44]">Mumbai, Maharashtra</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#3B82F6] mt-1" />
              <div>
                <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                <p className="text-[#0A1F44]">15 August 1990</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <h3 className="text-[#0A1F44] mb-6">Verification Status</h3>
        <div className="space-y-4">
          {[
            { name: 'Aadhaar', status: true },
            { name: 'PAN Card', status: true },
            { name: 'Bank Account', status: true },
            { name: 'Phone Number', status: true },
            { name: 'Email Address', status: true },
          ].map((item) => (
            <div 
              key={item.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#1E7F5C]" />
                <span className="text-[#0A1F44]">{item.name}</span>
              </div>
              <span className="px-3 py-1 bg-[#1E7F5C] text-white text-sm rounded-full flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Verified
              </span>
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
