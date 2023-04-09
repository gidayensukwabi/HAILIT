const dbFunctions = require("./functions.model");
const tableName = "customer";
const passwordTable = "password_info";
const passwordTableColumns = ["customer_id", "ps_salt", "ps_hash"];

const columnsToBeUpdated = [
  "first_name",
  "last_name",
  "email",
  "phone_number",
  "date_updated",
];
const columnsForCreation = [
  "customer_id",
  "first_name",
  "last_name",
  "email",
  "phone_number"
];
const getAllCustomers = () => dbFunctions.getAll("customer");

const getOneCustomer = async (customerID) => {
  const columnName = columnsForCreation[0];
  return await dbFunctions.getOne(tableName, columnName, customerID);
};

const oneCustomerQuery = async (customerEmail) => {
  const columnName = columnsForCreation[3];
  const customerDetails = await dbFunctions.getOne(
    tableName,
    columnName,
    customerEmail
  );
  const customerID = {customer_id: customerDetails[0].customer_id}
  return customerID;
};
//check if email exists
const emailExists = async (email) => {
  const columnName = columnsForCreation[3];
  return await dbFunctions.checkOneDetail(tableName, columnName, email);
};

//add customer METHOD: POST
const addCustomer = async (passwordPlusId, ...args) => {
  const email = args[3];

  try {
    if (!(await emailExists(email))) {
      const insertCustomerOtherDetails = await dbFunctions.addOne(
        tableName,
        columnsForCreation,
        ...args
      );
      if (insertCustomerOtherDetails) {
        const insertPassword = await dbFunctions.hashPassword(
          passwordPlusId,
          passwordTable,
          passwordTableColumns
        );
        if (insertPassword) {
          console.log("User added");
          return "User added";
        } else {
          console.log("error isnerting password");
          const queryText = `delete from ${tableName} where ${passwordTableColumns[0]} not in (select $1 from ${passwordTable})`;
          const value = [passwordTableColumns[0]]
          await dbFunctions.deleteAccountWithoutPassword(queryText, value);
          return "User not added to database";
        }
      }
    } else {
      console.log("user email exists");
      return "user email exists";
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const verifyCustomer = async (password, customer_id)=> {
  const tableDetails = [passwordTable, passwordTableColumns[0]]
  return await dbFunctions.verifyPassword(password, customer_id, tableDetails)
}

//update customer
const updateCustomer = async (customerID, customerDetails) => {
  try {
    const email = customerDetails[2];
    const emailColumn = columnsToBeUpdated[2]
    console.log('this is', email, emailColumn, customerID, customerDetails)
    // const queryText = `select ${columnsToBeUpdated[0]} from customer where customer_id = $1`
    // const idValidation = await DB.query(queryText, [customerID])
    const idValidation = await dbFunctions.checkOneDetail(
      tableName,
      columnsForCreation[0],
      customerID
    );
    const takenEmail = await dbFunctions.takenDetail(
      tableName,
      emailColumn,
      email
    );
    console.log('this is taken Email', takenEmail)
    console.log('this is idvalidation', idValidation)
    if (idValidation) {
      
      if (takenEmail === true) {
      return "user email taken";
      } else {
        
        const updateDate = "now()";
        customerDetails.push(updateDate);
        
        return await dbFunctions.updateOne(
          tableName,
          columnsToBeUpdated,
          customerID,
          ...customerDetails
        );
      }
  } 
    else {
      console.log("error");
      return "User Does Not Exist";
    }
  } catch (err) {
    console.log("could not update user. server error", err);
    return `Error, ${err}`
  }

 //dbFunctions.updateOne(tableName, columnsToBeUpdated, ...customerDetails);
};

const deleteCustomer = async (customerID) => {
  const columnName = columnsForCreation[0];
  const userExists = await dbFunctions.checkOneDetail(
    tableName,
    columnName,
    customerID
  );
  if (userExists) {
    await dbFunctions.deleteOne(tableName, columnName, customerID);
    return "user deleted";
  } else {
    console.log("user does not exist");
    return "user does not exist";
  }
};
module.exports = {
  getAllCustomers,
  getOneCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  emailExists,
  oneCustomerQuery,
  verifyCustomer
};
