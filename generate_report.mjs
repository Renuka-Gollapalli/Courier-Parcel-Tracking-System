import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToInclude = [
  { name: 'Database Schema (DDL & Initial Seed)', path: 'server/database_schema.sql', lang: 'sql' },
  { name: 'Backend Express Server', path: 'server/server.js', lang: 'javascript' },
  { name: 'Frontend Context (Database Link)', path: 'src/context/StateContext.jsx', lang: 'javascript' },
  { name: 'Parcels UI logic', path: 'src/pages/Parcels.jsx', lang: 'javascript' },
  { name: 'Dashboard Entry', path: 'src/pages/Dashboard.jsx', lang: 'javascript' }
];

let report = `# Logistics Database Application - Project Report

## 1. Project Description
The **Logistics and Fleet Management System** is a responsive, Full-Stack web application designed to track and manage core operational data for a logistics company. It fulfills Database Management System (DBMS) assignment requirements by creating a robust SQL schema and hooking it dynamically into graphical end-user software.

## 2. Technology Stack
- **Frontend GUI**: React.js (Vite), React Router DOM, Custom Glassmorphism CSS.
- **Backend API Server**: Node.js, Express.js.
- **Database Architecture**: MySQL Database (accessed via \`mysql2\` connection pooling).
- **Communication Flow**: UI triggers RESTful HTTP requests via the Fetch API; Backend translates payload into sanitized SQL queries.

## 3. Core Functional Requirements Met
1. **Record Viewing**: Dynamic Data Tables provided for all ER core entities.
2. **DML Operations**: Intuitive GUI to Insert, Update, and Delete records safely natively mapping to executing prepared SQL statements.
3. **Application-Based Processing**: Complex business logic handling Shipping Cost Calculations statically on the server tier before generating records.
4. **Specializations**: Seamless class specialization mappings by assigning Vehicles (Vans by volume, Motorcycles by CC) specifically mapped to Employee drivers.
5. **Weak Entities Tracking**: Native handling of sequential milestone (Tracking Events) mapped via composite Primary Keys.

---
## 4. Key Source Code Extracts
*(Included below are the core snippets required for the Project Logic. Note CSS styles, assets, and standard initialization components have been omitted to save length.)*

`;

for(const f of filesToInclude) {
  const p = path.join(__dirname, f.path);
  if(fs.existsSync(p)) {
    report += `\n### ${f.name} (\`${f.path}\`)\n\`\`\`${f.lang}\n`;
    report += fs.readFileSync(p, 'utf8');
    report += `\n\`\`\`\n`;
  } else {
      console.log('Skipping ' + p);
  }
}

fs.writeFileSync(path.join(__dirname, 'Project_Report_Materials.md'), report);
console.log('SUCCESS: Report generated at Project_Report_Materials.md');
