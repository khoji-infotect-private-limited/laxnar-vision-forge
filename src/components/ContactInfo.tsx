
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="lg:col-span-1 glass-card">
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-6 text-white">Contact Information</h3>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-4 p-2 bg-blue-900/30 rounded-full">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Email</h4>
              <p className="text-gray-300">laxnarai25@gmail.com</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 p-2 bg-blue-900/30 rounded-full">
              <Phone className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Phone</h4>
              <p className="text-gray-300">+(91) 9140982008</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="mr-4 p-2 bg-blue-900/30 rounded-full">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-medium text-white">Office</h4>
              <p className="text-gray-300">
                331 A, 1st Floor<br />
                Mahajan Handloom<br />
                Jhansi, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
