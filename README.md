# Career Guidance Portal

A comprehensive career guidance website designed to help students make informed decisions about their career paths after 10th and 12th standard. This platform provides detailed information about various career options, requirements, opportunities, and guidance for making the right choice.

## 🌟 Features

### Comprehensive Career Database
- **15+ Detailed Career Options** with comprehensive information
- **Expandable Career Cards** with detailed descriptions, requirements, and opportunities
- **Education Level Filtering** (After 10th and 12th standard)
- **Search Functionality** to find careers by name, skills, or subjects

### Career Information Includes:
- **Detailed Descriptions** explaining what each career entails
- **Required Subjects** for each career path
- **Essential Skills** needed for success
- **Educational Requirements** and qualifications
- **Salary Ranges** at different career stages
- **Duration** of education and training
- **Career Opportunities** and job roles
- **Future Prospects** and growth potential

### Interactive Features
- **Career Comparison Tool** - Compare up to 3 careers side by side
- **Save Careers** - Bookmark interesting career options
- **Expandable Details** - Click to see comprehensive information
- **Search & Filter** - Find careers based on your interests
- **Responsive Design** - Works on all devices

### Career Guidance Resources
- **Step-by-Step Guide** for choosing a career path
- **Self-Assessment Tips** to understand your interests
- **Research Guidelines** for exploring career options
- **Expert Advice** on making informed decisions
- **Important Tips** for students

## 🎯 Available Careers

### After 12th Standard:
1. **Engineering** - Mechanical, Electrical, Civil, Computer Science, and more
2. **Medical** - MBBS, Specializations, Healthcare careers
3. **Commerce** - Business, Finance, Accounting, Economics
4. **Arts & Humanities** - Literature, History, Social Sciences
5. **Law** - Legal studies and practice
6. **Design** - Graphic, UI/UX, Fashion, Product Design
7. **Hotel Management** - Hospitality and Tourism
8. **Agriculture** - Farming, Research, Agribusiness
9. **Aviation** - Piloting, Aircraft Maintenance, Air Traffic Control
10. **Fashion Technology** - Design, Manufacturing, Marketing
11. **Media & Journalism** - News, Content Creation, Broadcasting
12. **Psychology** - Clinical, Counseling, Research
13. **Environmental Science** - Conservation, Research, Policy

### After 10th Standard:
1. **ITI (Industrial Training Institute)** - Technical trades and crafts
2. **Polytechnic** - Diploma in engineering and technical fields

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd career-guidance-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/career_guidance
   JWT_SECRET=your-secret-key
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   Open your browser and go to `http://localhost:3000`

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern design
- **JavaScript (ES6+)** - Interactivity
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 📱 Features for Students

### Career Exploration
- Browse careers by education level
- Search for specific careers or skills
- View detailed information about each career
- Compare different career options

### Decision Making Tools
- **Career Comparison** - Side-by-side comparison of up to 3 careers
- **Save Favorites** - Bookmark careers for later review
- **Detailed Requirements** - Understand what's needed for each career
- **Salary Information** - Know earning potential at different stages

### Guidance Resources
- **6-Step Career Selection Process**
- **Self-Assessment Guidelines**
- **Research Tips**
- **Expert Advice**
- **Important Considerations**

## 🎨 Design Features

- **Modern UI/UX** with clean, professional design
- **Responsive Layout** that works on all devices
- **Interactive Elements** with smooth animations
- **Color-coded Information** for easy navigation
- **Accessible Design** for all users

## 🔧 Customization

### Adding New Careers
To add new careers, modify the `sampleCareers` array in `server.js`:

```javascript
{
    title: "Career Name",
    description: "Detailed description...",
    educationLevel: "12th", // or "10th"
    subjects: ["Subject1", "Subject2"],
    skills: ["Skill1", "Skill2"],
    salary: "Salary range",
    duration: "Duration",
    requirements: ["Requirement1", "Requirement2"],
    opportunities: ["Opportunity1", "Opportunity2"]
}
```

### Styling
- Modify `public/styles.css` for design changes
- Update color schemes in CSS variables
- Customize animations and transitions

## 📊 Database Schema

### User Schema
```javascript
{
    username: String,
    email: String,
    password: String,
    grade: String, // 10th or 12th
    interests: [String],
    createdAt: Date
}
```

### Career Schema
```javascript
{
    title: String,
    description: String,
    educationLevel: String, // 10th or 12th
    subjects: [String],
    skills: [String],
    salary: String,
    duration: String,
    requirements: [String],
    opportunities: [String]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: info@careerguide.com
- Phone: +91 98765 43210
- Address: 123 Career Street, Education City, India

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- MongoDB for database
- Express.js community for the framework

---

**Made with ❤️ for students seeking career guidance** 