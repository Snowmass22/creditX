from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)

model  = joblib.load("loan_model.pkl")
scaler = joblib.load("scaler.pkl")
ohe    = joblib.load("ohe.pkl")

OHE_COLS = ["Employment_Status", "Marital_Status", "Loan_Purpose",
            "Property_Area", "Gender", "Employer_Category"]

EDU_MAP = {"Bachelor": 0, "Master": 1, "PhD": 2}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        print("Received:", data)

        data["Education_Level"] = EDU_MAP.get(data["Education_Level"], 0)

        cat_df  = pd.DataFrame([{c: data[c] for c in OHE_COLS}])
        ohe_arr = ohe.transform(cat_df)

        num_arr = np.array([[
            float(data["Applicant_Income"]),
            float(data["Coapplicant_Income"]),
            float(data["Age"]),
            float(data["Dependents"]),
            float(data["Existing_Loans"]),
            float(data["Savings"]),
            float(data["Collateral_Value"]),
            float(data["Loan_Amount"]),
            float(data["Loan_Term"]),
            float(data["Education_Level"])
        ]])

        eng_arr = np.array([[
            float(data["DTI_Ratio"]) ** 2,
            float(data["Credit_Score"]) ** 2
        ]])

        full   = np.hstack([num_arr, ohe_arr, eng_arr])
        print("Feature count:", full.shape[1])
        scaled = scaler.transform(full)

        pred  = model.predict(scaled)[0]
        proba = model.predict_proba(scaled)[0][1]

        print("Prediction:", int(pred), "Confidence:", round(float(proba)*100, 1))

        return jsonify({
            "approved":   bool(pred == 1),
            "confidence": round(float(proba) * 100, 1)
        })

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True) 