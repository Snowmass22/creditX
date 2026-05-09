const express  = require("express");
const fetch    = require("node-fetch");
const app      = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const FLASK_URL = process.env.FLASK_URL || "http://localhost:5000";

// Wake Flask without crashing if it fails
(async () => {
  try {
    await fetch(`${FLASK_URL}/`);
    console.log("Flask is awake!");
  } catch (e) {
    console.log("Flask not ready yet, will retry on first request.");
  }
})();

app.get("/", (req, res) => res.render("index"));

app.post("/predict", async (req, res) => {
  try {
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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(`${FLASK_URL}/predict`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
      signal:  controller.signal
    });

    clearTimeout(timeout);

    const result = await response.json();
    res.render("result", {
      approved:   result.approved,
      confidence: result.confidence ?? "N/A"
    });

  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send(`
      <div style="font-family:sans-serif;text-align:center;margin-top:80px">
        <h2>⏳ ML service is warming up</h2>
        <p>Please wait 30 seconds and try again.</p>
        <a href="/" style="color:#4f46e5">← Go back and retry</a>
      </div>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express running on port ${PORT}`));