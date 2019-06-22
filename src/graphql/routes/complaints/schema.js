var { buildSchema } = require('graphql');

var schema = buildSchema(`
    type Query {
        complaints(limit: Int = 30, skip: Int = 0): [Complaint],
        filtercomplaints(ccode: String!, models: String, from: String, to: String): [Complaint]
    },
    type Complaint {
        Dealer_Code: String,
        Dealer_Code_Description: String,
        Dealer_City: String,
        PCR_Number: String,
        PCR_Year: String,
        VC_Number: String,
        VC_Description: String,
        Model: String,
        Sub_Model: String,
        Chassis_No: String,
        Chassis_Type: String,
        Production_Month: String,
        Kilometers_Covered: String,
        Complaint_Aggregate: String,
        Complaint_Aggregate_Description: String,
        Complaint_Group: String,
        Complaint_Group_Description: String,
        Complaint_Code: String,
        Complaint_Code_Description: String,
        Sale_Month: String,
        Complaint_Month: String,
        Complaint_Reported_Date: String,
        Diff_between_Complaint_Sales_Month: String,
        Settlement_Month: String,
        Settlement_Date: String,
        Claim_Category: String,
        Claim_Category_Description: String,
        Claims_Indicator: String,
        No_of_Complaints: String,
        Part_Number: String,
        Part_Description: String,
        Part_Quantity: String,
        Part_Rate: String,
        Actual_Labour_Charge: String,
        Miscellaneous_Charge: String,
        Special_Labour_Charges: String,
        Total_Expenses: String,
        Credit_Amount: String,
        Customer_Complaint: String,
        Investigation: String,
        Action_Taken: String,
    }
`);

module.exports = schema;