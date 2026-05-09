import joblib
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")

model  = joblib.load("loan_model.pkl")
scaler = joblib.load("scaler.pkl")
ohe    = joblib.load("ohe.pkl")

OHE_COLS = ["Employment_Status", "Marital_Status", "Loan_Purpose",
            "Property_Area", "Gender", "Employer_Category"]

EDU_MAP = {"Bachelor": 0, "Master": 1, "PhD": 2}

data = {
    "Applicant_Income":   85000,
    "Coapplicant_Income": 20000,
    "Age":                35,
    "Dependents":         1,
    "Existing_Loans":     0,
    "Savings":            50000,
    "Collateral_Value":   80000,
    "Loan_Amount":        20000,
    "Loan_Term":          36,
    "Education_Level":    1,
    "DTI_Ratio":          0.15,
    "Credit_Score":       780,
    "Employment_Status":  "Salaried",
    "Marital_Status":     "Married",
    "Loan_Purpose":       "Home",
    "Property_Area":      "Urban",
    "Gender":             "Male",
    "Employer_Category":  "Government"
}

cat_df  = pd.DataFrame([{c: data[c] for c in OHE_COLS}])
ohe_arr = ohe.transform(cat_df)

# Numerical columns first (without DTI_sq and CS_sq)
num_arr = np.array([[
    data["Applicant_Income"],
    data["Coapplicant_Income"],
    data["Age"],
    data["Dependents"],
    data["Existing_Loans"],
    data["Savings"],
    data["Collateral_Value"],
    data["Loan_Amount"],
    data["Loan_Term"],
    data["Education_Level"]
]])

# Engineered features LAST (after OHE)
eng_arr = np.array([[
    data["DTI_Ratio"] ** 2,
    data["Credit_Score"] ** 2
]])

# Correct order: num → ohe → engineered
full = np.hstack([num_arr, ohe_arr, eng_arr])
print("Feature count:", full.shape[1])

scaled = scaler.transform(full)
pred   = model.predict(scaled)[0]
proba  = model.predict_proba(scaled)

print("Raw probabilities:", proba)
print("Prediction:", "Approved" if pred == 1 else "Rejected")