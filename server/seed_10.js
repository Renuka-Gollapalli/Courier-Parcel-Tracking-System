const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME, port: process.env.DB_PORT || 3306,
    multipleStatements: true
  });
  
  const sql = `
    INSERT IGNORE INTO SERVICE_CENTRE (CENTRE_ID) VALUES 
      ('SC-001'), ('SC-002'), ('SC-003'), ('SC-004'), ('SC-005'), 
      ('SC-006'), ('SC-007'), ('SC-008'), ('SC-009'), ('SC-010');

    INSERT IGNORE INTO CUSTOMER (CUSTOMER_ID, FIRST_NAME, LAST_NAME, STREET, CITY, ZIP_CODE, PHONE_NUMBER) VALUES 
      ('C1001', 'Renuka', 'Gollapalli', '7 LB Road', 'Hyderabad', '533030', '9018273546'),
      ('C1002', 'Meera', 'Sharma', '13 River Rd', 'Chennai', '600127', '9823567812'),
      ('C1003', 'Anil', 'Kumar', '45 MG Road', 'Mumbai', '400001', '9123456780'),
      ('C1004', 'Priya', 'Singh', '12 Lake View', 'Bangalore', '560001', '9876543210'),
      ('C1005', 'Rajesh', 'Gupta', '88 High St', 'Delhi', '110001', '9988776655'),
      ('C1006', 'Sneha', 'Reddy', '3 Park Ave', 'Pune', '411001', '9001122334'),
      ('C1007', 'Vikram', 'Patel', '55 Ring Road', 'Ahmedabad', '380001', '9911223344'),
      ('C1008', 'Neha', 'Desai', '9 Riverfront', 'Kolkata', '700001', '9080706050'),
      ('C1009', 'Arjun', 'Rao', '101 City Center', 'Jaipur', '302001', '9123123123'),
      ('C1010', 'Kiran', 'Shah', '77 Tower', 'Surat', '395001', '9012901234');

    INSERT IGNORE INTO EMPLOYEE (EMPLOYEE_ID, NAME, SALARY, CENTRE_ID) VALUES 
      ('E001', 'Renuka', 45000, 'SC-001'),
      ('E002', 'Kavita', 42000, 'SC-001'),
      ('E003', 'Akash', 89000, 'SC-002'),
      ('E004', 'Rahul', 35000, 'SC-003'),
      ('E005', 'Suresh', 38000, 'SC-004'),
      ('E006', 'Dinesh', 41000, 'SC-005'),
      ('E007', 'Anita', 46000, 'SC-006'),
      ('E008', 'Gita', 32000, 'SC-007'),
      ('E009', 'Mahesh', 39000, 'SC-008'),
      ('E010', 'Ramesh', 47000, 'SC-009');

    INSERT IGNORE INTO PARCEL (TRACKING_NUMBER, WEIGHT, LOCATION, CUSTOMER_ID) VALUES 
      ('TN-1000', 1.2, 'Sorting Hub', 'C1001'),
      ('TN-1001', 5.5, 'Out for delivery', 'C1002'),
      ('TN-1002', 2.1, 'In Transit', 'C1003'),
      ('TN-1003', 0.5, 'Delivered', 'C1004'),
      ('TN-1004', 3.4, 'Sorting Hub', 'C1005'),
      ('TN-1005', 10.0, 'Picked Up', 'C1006'),
      ('TN-1006', 7.5, 'Out for delivery', 'C1007'),
      ('TN-1007', 4.2, 'Delivered', 'C1008'),
      ('TN-1008', 2.8, 'In Transit', 'C1009'),
      ('TN-1009', 1.1, 'Sorting Hub', 'C1010');

    INSERT IGNORE INTO VAN (EMPLOYEE_ID, CARGO_VOLUME) VALUES 
      ('E001', 15.5), ('E004', 12.0), ('E006', 18.5), ('E008', 14.0), ('E010', 20.0);

    INSERT IGNORE INTO MOTORCYCLE (EMPLOYEE_ID, ENGINE_CAPACITY) VALUES 
      ('E002', '150cc'), ('E003', '250cc'), ('E005', '125cc'), ('E007', '200cc'), ('E009', '150cc');

    INSERT IGNORE INTO TRACKING_EVENT (TRACKING_NUMBER, EVENT_NUMBER, EVENT_DESCRIPTION) VALUES 
      ('TN-1000', 1, 'Package Picked Up'), ('TN-1000', 2, 'Arrived at Sorting Hub'),
      ('TN-1001', 1, 'Package Picked Up'), ('TN-1001', 2, 'Out for Delivery'),
      ('TN-1002', 1, 'Picked Up'), ('TN-1002', 2, 'In Transit'),
      ('TN-1003', 1, 'Out for Delivery'), ('TN-1003', 2, 'Delivered'),
      ('TN-1004', 1, 'Picked Up'), ('TN-1004', 2, 'Sorting Hub'),
      ('TN-1005', 1, 'Picked Up'), ('TN-1006', 1, 'Picked Up'), ('TN-1006', 2, 'Out for Delivery'),
      ('TN-1007', 1, 'Out for Delivery'), ('TN-1007', 2, 'Delivered'),
      ('TN-1008', 1, 'Picked Up'), ('TN-1008', 2, 'In Transit');
  `;
  await connection.query(sql);
  console.log('Successfully inserted exactly 10 records for each core table.');
  process.exit(0);
}
seed();
