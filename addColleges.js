const mongoose = require('mongoose');

// Define the College schema (copy from server.js for standalone use)
const collegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    region: { type: String, required: true },
    type: { type: String, required: true },
    nirfRank: Number,
    established: Number,
    website: String,
    contact: String,
    address: String,
    facilities: [String],
    specializations: [String],
    mhtcetCutoffs: {
        computer: { type: Number, default: 0 },
        mechanical: { type: Number, default: 0 },
        electrical: { type: Number, default: 0 },
        civil: { type: Number, default: 0 },
        it: { type: Number, default: 0 },
        ai: { type: Number, default: 0 },
        dataScience: { type: Number, default: 0 }
    },
    fees: {
        government: String,
        private: String,
        nri: String
    },
    placement: {
        averagePackage: String,
        highestPackage: String,
        placementPercentage: String,
        topRecruiters: [String]
    },
    admissionProcess: [String],
    documents: [String],
    importantDates: [String],
    image: String
});

const College = mongoose.model('College', collegeSchema);

mongoose.connect('mongodb://localhost:27017/career_guidance', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const colleges = [
  {
    name: "National Institute of Technology (NIT) Srinagar",
    location: "Srinagar",
    region: "Srinagar",
    type: "Government",
    nirfRank: 82,
    established: 1960,
    website: "https://nitsri.ac.in",
    contact: "+91-194-2424809",
    address: "Hazratbal, Srinagar, Jammu & Kashmir 190006",
    facilities: ["Hostel", "Library", "Labs", "Sports Complex", "WiFi Campus", "Cafeteria"],
    specializations: ["Computer Science", "Mechanical Engineering", "Electrical Engineering", "Civil Engineering", "Electronics & Communication"],
    mhtcetCutoffs: { computer: 99.2, mechanical: 97.0, electrical: 96.8, civil: 95.0, it: 98.0, ai: 98.5, dataScience: 98.2 },
    fees: { government: "₹1.5-2 LPA", private: "N/A", nri: "₹8-10 LPA" },
    placement: {
      averagePackage: "₹8 LPA",
      highestPackage: "₹32 LPA",
      placementPercentage: "85%",
      topRecruiters: ["Infosys", "Wipro", "TCS", "L&T", "Tech Mahindra", "Capgemini"]
    },
    admissionProcess: ["JEE Main (National Level)", "JoSAA/CSAB Counselling", "Document Verification"],
    documents: ["JEE Main Score Card", "10th & 12th Marksheets", "Domicile Certificate", "Category Certificate (if applicable)", "Passport Photos"],
    importantDates: ["JEE Main Registration: December 2023", "JEE Main Exam: April 2024", "Counselling: June 2024", "Seat Allotment: July 2024"],
    image: "/images/nit-srinagar.jpg"
  },
  {
    name: "Government College of Engineering and Technology (GCET) Jammu",
    location: "Jammu",
    region: "Jammu",
    type: "Government",
    nirfRank: 201,
    established: 1994,
    website: "https://gcetjammu.org.in",
    contact: "+91-191-2623082",
    address: "GCET, Chak Bhalwal, Jammu, J&K 181122",
    facilities: ["Labs", "Library", "Hostel", "Cafeteria", "Sports Complex"],
    specializations: ["Computer Engineering", "Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Electronics & Communication"],
    mhtcetCutoffs: { computer: 95, mechanical: 92, electrical: 91, civil: 90, it: 93, ai: 94, dataScience: 94 },
    fees: { government: "₹70,000 - ₹1 LPA", private: "N/A", nri: "N/A" },
    placement: {
      averagePackage: "₹4.5 LPA",
      highestPackage: "₹12 LPA",
      placementPercentage: "70%",
      topRecruiters: ["Infosys", "HCL", "Wipro", "Capgemini"]
    },
    admissionProcess: ["JKCET Entrance Exam", "Counselling by JKBOPEE", "Document Verification"],
    documents: ["JKCET Score Card", "10th & 12th Marksheets", "Domicile Certificate", "Category Certificate (if any)", "Passport Photos"],
    importantDates: ["JKCET Application: March 2024", "JKCET Exam: May 2024", "Counselling: June 2024", "Admission: July 2024"],
    image: "/images/gcet-jammu.jpg"
  },
  {
    name: "Shri Mata Vaishno Devi University (SMVDU)",
    location: "Katra",
    region: "Jammu",
    type: "Government",
    nirfRank: 165,
    established: 1999,
    website: "https://smvdu.ac.in",
    contact: "+91-1991-285524",
    address: "Katra, Reasi, Jammu & Kashmir 182320",
    facilities: ["State-of-art Labs", "Central Library", "Hostels", "Medical Center", "Sports Complex"],
    specializations: ["Computer Science", "Electronics", "Mechanical Engineering", "Civil Engineering", "Architecture"],
    mhtcetCutoffs: { computer: 97, mechanical: 94, electrical: 93, civil: 92, it: 96, ai: 97, dataScience: 96 },
    fees: { government: "₹1.2-1.5 LPA", private: "N/A", nri: "₹5-6 LPA" },
    placement: {
      averagePackage: "₹6.5 LPA",
      highestPackage: "₹18 LPA",
      placementPercentage: "80%",
      topRecruiters: ["Microsoft", "Amazon", "TCS", "Infosys", "Wipro", "L&T"]
    },
    admissionProcess: ["JEE Main Score", "SMVDU Counselling", "Document Verification"],
    documents: ["JEE Main Score Card", "12th Marksheet", "Domicile Certificate", "Category Certificate (if applicable)"],
    importantDates: ["Application: April 2024", "Counselling: June 2024", "Admission: July 2024", "Classes Begin: August 2024"],
    image: "/images/smvdu-katra.jpg"
  },
  {
    name: "University of Kashmir - Faculty of Engineering",
    location: "Srinagar",
    region: "Kashmir",
    type: "Government",
    nirfRank: 180,
    established: 1969,
    website: "https://kashmiruniversity.net",
    contact: "+91-194-2414049",
    address: "Hazratbal, Srinagar, Kashmir 190006",
    facilities: ["Central Library", "Research Labs", "Hostels", "Sports Facilities", "Medical Center"],
    specializations: ["Computer Science", "Electronics", "Civil Engineering", "Mechanical Engineering"],
    mhtcetCutoffs: { computer: 96, mechanical: 93, electrical: 92, civil: 91, it: 95, ai: 0, dataScience: 0 },
    fees: { government: "₹60,000 - ₹80,000", private: "N/A", nri: "₹2-3 LPA" },
    placement: {
      averagePackage: "₹3.8 LPA",
      highestPackage: "₹8 LPA",
      placementPercentage: "65%",
      topRecruiters: ["TCS", "Infosys", "Wipro", "Local IT Companies"]
    },
    admissionProcess: ["JKCET Entrance Exam", "University Counselling", "Merit-based Selection"],
    documents: ["JKCET Score Card", "Academic Transcripts", "Domicile Certificate", "Character Certificate"],
    importantDates: ["Application: March 2024", "Entrance Exam: May 2024", "Counselling: June 2024", "Classes Begin: August 2024"],
    image: "/images/kashmir-university.jpg"
  }
];

// First clear existing colleges, then add new ones
College.deleteMany({})
  .then(() => {
    console.log('Existing colleges cleared');
    return College.insertMany(colleges);
  })
  .then(() => {
    console.log('Jammu & Kashmir colleges added successfully!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error:', err);
    mongoose.disconnect();
  }); 