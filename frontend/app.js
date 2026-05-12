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

app.get("/", (req, res) => res.render("index-updated"));

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

    // ── HARDCODED REASON LOGIC ──
    // Check the applicant's data and build a human-readable reason.
    const reasons = [];

    if (result.approved) {
      // Positive factors
      if (payload.Credit_Score >= 750)
        reasons.push("Excellent credit score of " + payload.Credit_Score);
      else if (payload.Credit_Score >= 600)
        reasons.push("Good credit score of " + payload.Credit_Score);

      if (payload.DTI_Ratio <= 0.35)
        reasons.push("Healthy debt-to-income ratio (" + payload.DTI_Ratio + ")");

      if (payload.Savings >= payload.Loan_Amount * 0.2)
        reasons.push("Strong savings relative to loan amount");

      if (payload.Employment_Status === "Salaried" || payload.Employment_Status === "Government")
        reasons.push("Stable employment (" + payload.Employment_Status + ")");

      if (payload.Collateral_Value > 0)
        reasons.push("Collateral provided adds security");

      if (reasons.length === 0)
        reasons.push("Your overall financial profile meets our lending criteria");

    } else {
      // Negative factors
      if (payload.Credit_Score < 500)
        reasons.push("Low credit score (" + payload.Credit_Score + " — minimum recommended is 600)");
      else if (payload.Credit_Score < 600)
        reasons.push("Below-average credit score of " + payload.Credit_Score);

      if (payload.DTI_Ratio > 0.5)
        reasons.push("High debt-to-income ratio (" + payload.DTI_Ratio + " — should be below 0.5)");

      if (payload.Savings < payload.Loan_Amount * 0.1)
        reasons.push("Insufficient savings compared to the requested loan amount");

      if (payload.Existing_Loans >= 3)
        reasons.push("Too many existing loans (" + payload.Existing_Loans + ")");

      if (payload.Employment_Status === "Unemployed")
        reasons.push("No current employment or income source");

      if (reasons.length === 0)
        reasons.push("Your combined financial profile does not meet the current lending criteria");
    }

    const reason = reasons.join(". ") + ".";
    // ── END OF REASON LOGIC ──

    res.render("result-updated", {
      approved:   result.approved,
      confidence: result.confidence ?? "N/A",
      reason:     reason
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