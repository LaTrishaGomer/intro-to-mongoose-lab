const mongoose = require('mongoose');
const dotenv = require('dotenv');
const prompt = require('prompt-sync')();
const Customer = require('./models/customer');

dotenv.config(); // make the env variables available

const connect = async () => {
    // connect to mongodb
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    // run our program
    await runProgram();
    // disconnect from mongodb
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    // exit process
    process.exit();
};

const createCustomer = async () => {
    const name = prompt('Please enter the customer name: ');
    const age = prompt('Please enter the customer age: ');

    await Customer.create({ name, age });

    console.log('Customer created successfully');
};

const viewCustomers = async () => {
    const customers = await Customer.find({});
    if (customers.length === 0) {
        console.log('There are no customers in the database');
        return;
    }
    customers.forEach(cust => {
        console.log(`id: ${cust._id} -- Name: ${cust.name}, Age: ${cust.age}`);
    });
};

const updateCustomer = async () => {
    // list all the customers first
    await viewCustomers();
    // prompt the user for the customer id
    const id = prompt('Copy and paste the id of the customer you would like to update here: ')
    // prompt the user for the new customer name
    const name = prompt('What is the customers new name?');
    // prompt the user for the new customer age
    const age = prompt('What is the customers new age?');
    // perform the update
    await Customer.findByIdAndUpdate(id, { name, age });
    // console log a success message
    console.log('Customer updated!');
};

const deleteCustomer = async () => {
    await viewCustomers();
    const id = prompt('Copy and paste the id of the customer you would like to delete here: ')
    await Customer.findByIdAndDelete(id);
    console.log('Customer deleted successfully!');
};

const runProgram = async () => {
    let command;

    while (command !== 5) {

        command = prompt(`
            Welcome to the CRM
            
            What would you like to do?
            
            1. Create a customer
            2. View all customers
            3. Update a customer
            4. Delete a customer
            5. Quit
            
    Number of action to run: `);

        command = parseInt(command); // convert string input into integer

        if (command === 1) {
            console.log('Create customer');
            await createCustomer();
        } else if (command === 2) {
            console.log('View customers');
            await viewCustomers();
        } else if (command === 3) {
            console.log('Update a customer');
            await updateCustomer();
        } else if (command === 4) {
            console.log('Delete a customer');
            await deleteCustomer();
        } else if (command === 5) {
            console.log('exiting ...')
            break;
        }
    }
};


connect();