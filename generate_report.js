const fs = require('fs');
const path = require('path');

const basePath = 'C:/Users/renuk/.gemini/antigravity/scratch/logistics-app';

const filesToInclude = [
  { name: 'Database Schema (DDL & Initial Seed)', path: 'server/database_schema.sql', lang: 'sql' },
  { name: 'Backend Express Node.js Server (REST APIs)', path: 'server/server.js', lang: 'javascript' },
  { name: 'Frontend-Backend Integration Context', path: 'src/context/StateContext.jsx', lang: 'javascript' },
  { name: 'Parcels UI & Business Logic Integration', path: 'src/pages/Parcels.jsx', lang: 'javascript' },
  { name: 'Dashboard Statistics UI', path: 'src/pages/Dashboard.jsx', lang: 'javascript' }
];

let report = `# Logistics Database Application - Project Report

## 1. Project Description
The **Logistics and Fleet Management System** is a responsive, Full-Stack web application designed to track and manage core operational data for a logistics company. It transitions a conceptual Entity-Relationship (ER) design into a robust relational database architecture, bridging the gap between database administration and end-user enterprise software.

## 2. Technology Stack
- **Frontend Engine**: React.js (built on Vite)
- **Routing & Navigation**: \`react-router-dom\`
- **Backend API Server**: Node.js with Express.js
- **Database Architecture**: MySQL Database (accessed via \`mysql2\` connection pooling)
- **UI/UX Design**: Custom CSS featuring a modern "Glassmorphism" aesthetic with intuitive modals.

## 3. Core Functional Requirements Met
1. **Record Viewing Operations**: Dynamic Data Tables provided for all core ER entities (Customers, Employees, Parcels, Vehicles, etc.) featuring search capability and pagination.
2. **DML Operations**: End-users can intuitively Insert, Update, and Delete records safely from the graphical interface via forms, automatically translating to prepared SQL queries on the backend to prevent SQL Injection.
3. **Application-Based Processing**: Integrated dynamic **Shipping Cost Calculation** business logic. The application dynamically computes shipping rates based on item weight (Base fee ₹50 + ₹20 per kg) via a dedicated REST API endpoint before a parcel is finalized and inserted to the database.
4. **Specialization/Subclass Handling**: Seamless tracking of vehicles by implementing distinct logic constraints for Vans (Cargo Volume tracking) vs. Motorcycles (Engine Capacity tracking) tied to Employee drivers.
5. **Weak Entities**: Full tracking of sequential milestone events (Tracking Events) mapped natively to specific Parcels via composite primary keys.

---
## 4. Key Source Code Extracts

*(Note: CSS styling code and boilerplate configuration files are omitted to focus entirely on core business/database logic)*

`;

for(const file of filesToInclude) {
  const absolutePath = path.join(basePath, file.path);
  if(fs.existsSync(absolutePath)) {
    report += `### ${file.name} (\`${file.path}\`)\n\`\`\`${file.lang}\n`;
    report += fs.readFileSync(absolutePath, 'utf8');
    report += `\n\`\`\`\n\n`;
  }
}

fs.writeFileSync(path.join(basePath, 'Project_Report_Materials.md'), report);
console.log('Report generated at Project_Report_Materials.md');
