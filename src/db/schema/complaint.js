const mangoose = require('mongoose');
const Schema = mangoose.Schema;

const toTimeStamp = (date) => Date.parse(date); 

var complaintSchema = new Schema({
    __v: { 
        type: Number, 
        select: false
    },
    Dealer_Code: {
        type: String
    },
    Dealer_Code_Description: {
        type: String
    },
    Dealer_City: {
        type: String
    },
    PCR_Number: {
        type: String
    },
    VC_Number: {
        type: String
    },
    VC_Description: {
        type: String
    },
    Model: {
        type: String
    },
    Sub_Model: {
        type: String
    },
    Chassis_No: {
        type: String
    },
    Chassis_Type: {
        type: String
    },
    Production_Month: {
        type: String
    },
    Kilometers_Covered: {
        type: String
    },
    Complaint_Group: {
        type: String
    },
    Complaint_Group_Description: {
        type: String
    },
    Complaint_Code: {
        type: String
    },
    Complaint_Code_Description: {
        type: String
    },
    Sale_Month: {
        type: String
    },
    Complaint_Month: {
        type:  Number,
        set: toTimeStamp
    },
    Complaint_Reported_Date: {
        type: String
    },
    Diff_between_Complaint_Sales_Month: {
        type: String
    },
    Claim_Category: {
        type: String
    },
    Claim_Category_Description: {
        type: String
    },
    Claims_Indicator: {
        type: String
    },
    No_of_Complaints: {
        type: String
    },
    Part_Number: {
        type: String
    },
    Part_Description: {
        type: String
    },
    Part_Quantity: {
        type: String
    },
    Part_Rate: {
        type: String
    },
    Actual_Labour_Charge: {
        type: String
    },
    Miscellaneous_Charge: {
        type: String
    },
    Special_Labour_Charges: {
        type: String
    },
    Total_Expenses: {
        type: String
    },
    Customer_Complaint: {
        type: String
    },
    Investigation: {
        type: String
    },
    Action_Taken: {
        type: String
    },
});

module.exports = mangoose.model('Complaint', complaintSchema);