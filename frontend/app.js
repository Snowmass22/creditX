const express = require("express");
const fetch   = require("node-fetch");
const app     = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => res.render("index"));

app.post("/predict", async (req, res) => {
  const body = req.body;

  const payload = {
    Applicant_Income:   parseFloat(body.Applicant_Income),
    Coapplicant_Income: parseFloat(body.Coapplicant_Income) || 0,
    Age:                parseFloat(body.Age),
    Dependents:         parseFloat(body.Dependents) || 0,
    Existing_Loans:     parseFloat(body.Existing_Loans) || 0,
    Savings:            parseFloat(body.Savings),
    Collateral_Value:   parseFloat(body.Collateral_Value) || 0,
    Loan_Amount:        parseFloat(body.Loan_Amount),
    Loan_Term:          parseFloat(body.Loan_Term),
    Credit_Score:       parseFloat(body.Credit_Score),
    DTI_Ratio:          parseFloat(body.DTI_Ratio),
    Education_Level:    body.Education_Level,
    Employment_Status:  body.Employment_Status,
    Marital_Status:     body.Marital_Status,
    Loan_Purpose:       body.Loan_Purpose,
    Property_Area:      body.Property_Area,
    Gender:             body.Gender,
    Employer_Category:  body.Employer_Category,
  };

  const response = await fetch("http://localhost:5000/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const result = await response.json();
  res.render("result", {
    approved:   result.approved,
    confidence: result.confidence ?? "N/A"
  });
});

app.listen(3000, () => console.log("Express running on http://localhost:3000"));