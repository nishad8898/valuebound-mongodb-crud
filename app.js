const { MongoClient } = require('mongodb');
const employeeData = require('./employeeData');

const main = async () => {
  const uri = 'mongodb://127.0.0.1:27017/';

  const client = new MongoClient(uri);

  try {
    await client.connect();

    /*------------run all commands one by one to see the results in the console----------------*/

    //await listDatabases(client); //list all databases

    //await createMultipleemployees(client, employeeData); //create employees with 10 employee data

    //await updateAllEmployeesExperience(client); //update or increase all employees experience by 1

    //await deleteEmployeesByName(client, ['sachin nishad', 'ankit mishra']); //delete employees by array of name

    //await deleteEmployeesByName(client, {}); //delete all employees

    //await deleteDatabase(client);

    await readAllEmployees(client); //read all employees data
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
};

const dbName = 'employee_db';
const collection = 'employee';

main().catch(console.error);

//drop database
const deleteDatabase = async (client) => {
  const result = await client.db(dbName).dropDatabase();
  if (result) console.log(`${dbName} database deleted`);
};

//delete all or perticular employee in documents
const deleteEmployeesByName = async (client, employeeName) => {
  let result = undefined;
  if (Array.isArray(employeeName)) {
    result = await client
      .db(dbName)
      .collection(collection)
      .deleteMany({ name: { $in: employeeName } });
  } else {
    result = await client
      .db(dbName)
      .collection(collection)
      .deleteMany(employeeName);
  }

  console.log(`${result.deletedCount} document(s) was/were deleted.`);
};

//update all documents
const updateAllEmployeesExperience = async (client) => {
  const result = await client
    .db(dbName)
    .collection(collection)
    .updateMany({}, { $inc: { experience: 1 } });
  console.log(`${result.matchedCount} document(s) matched the query.`);
  console.log(`${result.modifiedCount} document(s) was/were updated.`);
};

//read all documents
const readAllEmployees = async (client) => {
  const cursor = await client.db(dbName).collection(collection).find();
  const results = await cursor.toArray();
  console.log('found employees as:');
  results.forEach((result, i) => {
    console.log(`----------------${i + 1}----------------`);
    console.log();
    console.log(`Name: ${result.name}`);
    console.log(`Education: ${result.education}`);
    console.log(`Profession: ${result.profession}`);
    console.log(`Experience: ${result.experience}`);
    console.log(`Age: ${result.age}`);
    console.log(`Nationailty: ${result.nationality}`);
    console.log(`Location: ${result.location}`);
    console.log(`Date Of Birth: ${result.dob}`);
    console.log();
  });
};

//create multiple documents
const createMultipleemployees = async (client, newEmployee) => {
  const result = await client
    .db(dbName)
    .collection(collection)
    .insertMany(newEmployee);

  console.log(
    `${result.insertedCount} new listing(s) created with the following id(s):`
  );
  console.log(result.insertedIds);
};

//list databases
const listDatabases = async (client) => {
  databasesList = await client.db().admin().listDatabases();
  console.log('Databases:');
  databasesList.databases.forEach((db) => {
    console.log(` - ${db.name}`);
  });
};
