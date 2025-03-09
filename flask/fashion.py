#!/usr/bin/env python
# coding: utf-8

# In[ ]:


from flask import Flask, request, jsonify
import pickle
import pandas as pd
import re
import string
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.preprocessing import LabelEncoder
from sklearn.utils import resample

import http.client
import json
import time
import re
from googleapiclient.discovery import build
from google.oauth2 import service_account


# In[4]:


nltk.download('vader_lexicon')
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')


# In[5]:


app = Flask(__name__)
sentiments = SentimentIntensityAnalyzer()
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
def text_processing(text):
    text = text.lower()
    text = re.sub(r'\n', ' ', text)
    text = re.sub(f'[{re.escape(string.punctuation)}]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


# In[6]:

@app.route('/api/v1/fashion-details', methods=['GET'])
def get_fashion_details():
    _asin_ = request.args.get('asin')
    if not _asin_:
        return jsonify({'error': 'ASIN is required'}), 400

    # API Connection
    conn = http.client.HTTPSConnection("real-time-amazon-data.p.rapidapi.com")

    headers = {
        'x-rapidapi-key': "d98e16b541msh0f53a3894644030p19cb15jsnbc3a5d0eb845",
        'x-rapidapi-host': "real-time-amazon-data.p.rapidapi.com"
    }

    api_asin = _asin_

    # Make API Request
    conn.request("GET", f"/product-details?asin={api_asin}&country=US", headers=headers)
    res = conn.getresponse()
    data = res.read()
    decoded_data = data.decode("utf-8")

    # Parse JSON Response
    json_data = json.loads(decoded_data)

    # Extract Required Fields
    asin = json_data["data"].get("asin", "N/A")
    product_slug = json_data["data"].get("product_slug", "N/A")
    product_byline_link = json_data["data"].get("product_byline_link", "N/A")
    product_url_h = json_data["data"].get("product_url", "N/A")
    product_photo = json_data["data"].get("product_photo", "N/A")

    # Print Each Value Individually
    print("ASIN:", asin)
    print("Product Slug:", product_slug)
    print("Product Byline Link:", product_byline_link)

    # Function to generate the review URL
    def generate_reviews_link(product_url, product_slug, use_slug=False):
        """Extracts ASIN from the URL and generates the Amazon review page link."""
        asin_match = re.search(r'/dp/([A-Z0-9]{10})', product_url)
        if not asin_match:
            return "ASIN not found in the URL."

        asin_in = asin_match.group(1)
        
        if use_slug and product_slug != "N/A":
            return f"https://www.amazon.com/{product_slug}/product-reviews/{asin_in}/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"
        else:
            return f"https://www.amazon.com/product-reviews/{asin_in}/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"

    # Generate initial product review URL
    product_url = product_url_h
    product_review_url = generate_reviews_link(product_url, product_slug)

    print(f"Generated Reviews URL: {product_review_url}")

    # Google Sheets API Authentication
    SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
    SERVICE_ACCOUNT_FILE = "revana-12df37642aa4.json"

    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    sheets_service = build("sheets", "v4", credentials=credentials)

    # Google Sheets ID
    SHEET_ID = "1EvNPkMSSym5rk6H6ao4G_Db0hduf9X69KXYpi7ObBCg"

    # Data to insert
    URL = product_review_url
    PARAMETERS = ["review_rating", "review_title", "review_body"]  # Parameters to scrape

    # Write URL to A1
    sheets_service.spreadsheets().values().update(
        spreadsheetId=SHEET_ID,
        range="A1",
        valueInputOption="USER_ENTERED",
        body={"values": [[URL]]}
    ).execute()

    # Write parameters to B1:D1
    sheets_service.spreadsheets().values().update(
        spreadsheetId=SHEET_ID,
        range="B1:D1",
        valueInputOption="USER_ENTERED",
        body={"values": [PARAMETERS]}
    ).execute()

    # Write IMPORTFROMWEB formula in E1
    formula = '=IMPORTFROMWEB(A1, B1:D1)'
    sheets_service.spreadsheets().values().update(
        spreadsheetId=SHEET_ID,
        range="E1",
        valueInputOption="USER_ENTERED",
        body={"values": [[formula]]}
    ).execute()

    print("Formula written to Google Sheets. Waiting for data...")

    # Wait for ImportFromWeb to fetch data
    time.sleep(60)  # Adjust delay if needed

    # Read processed data from E1:G10
    response = sheets_service.spreadsheets().values().get(
        spreadsheetId=SHEET_ID,
        range="E1:G10"
    ).execute()

    # ✅ Convert response data into JSON
    json_data = []
    if "values" in response:
        rows = response["values"]

        for row in rows:
            # Ensure all fields are filled, default to "N/A" if missing
            data_entry = {PARAMETERS[i]: row[i] if i < len(row) else "N/A" for i in range(len(PARAMETERS))}
            json_data.append(data_entry)

    # ✅ Check if the page was not found and retry with product_slug
    if json_data and json_data[0]["review_rating"] == "#PAGE_NOT_FOUND":
        print("Page not found. Retrying with product slug in URL...")

        # Generate review URL with product slug
        product_review_url = generate_reviews_link(product_url, product_slug, use_slug=True)
        
        print(f"Generated Reviews URL: {product_review_url}")

        # Write updated URL to A1
        sheets_service.spreadsheets().values().update(
            spreadsheetId=SHEET_ID,
            range="A1",
            valueInputOption="USER_ENTERED",
            body={"values": [[product_review_url]]}
        ).execute()

        # Wait for new data to be fetched
        time.sleep(60)

        # Read updated data from E1:G10
        response = sheets_service.spreadsheets().values().get(
            spreadsheetId=SHEET_ID,
            range="E1:G10"
        ).execute()

        # Convert new response data to JSON
        json_data = []
        if "values" in response:
            rows = response["values"]
            for row in rows:
                data_entry = {PARAMETERS[i]: row[i] if i < len(row) else "N/A" for i in range(len(PARAMETERS))}
                json_data.append(data_entry)

    # ✅ Print final JSON result
    if json_data:
        print(json.dumps(json_data, indent=4, ensure_ascii=False))
        
    else:
        print("Error: No review data retrieved from Google Sheets.")
    
    



# @app.route('/api/v1/youtube-comments', methods=['POST'])
# def process_comments():
#     data = request.json
#     comments = data.get("comments", [])

#     if not comments:
#         return jsonify({'error': 'No comments provided'}), 400

#     df = pd.DataFrame(comments, columns=["Comment"])
#     df = df.dropna(subset=["Comment"])


#     df["Positive"] = df["Comment"].apply(lambda x: sentiments.polarity_scores(str(x))["pos"])
#     df["Negative"] = df["Comment"].apply(lambda x: sentiments.polarity_scores(str(x))["neg"])
#     df["Neutral"] = df["Comment"].apply(lambda x: sentiments.polarity_scores(str(x))["neu"])
#     df['Compound'] = df["Comment"].apply(lambda x: sentiments.polarity_scores(str(x))["compound"])

#     sentiment = []
#     for score in df["Compound"]:
#         if score >= 0.04:
#             sentiment.append('Positive')
#         elif score <= -0.05:
#             sentiment.append('Negative')
#         else:
#             sentiment.append('Neutral')

#     df["Sentiment"] = sentiment
#     df = df.drop(['Positive', 'Negative', 'Neutral', 'Compound'], axis=1)
#     df['Comment'] = df['Comment'].astype(str).apply(text_processing)

#     le = LabelEncoder()
#     df['Sentiment'] = le.fit_transform(df['Sentiment'])

#     processed_comments = df[['Comment', 'Sentiment']].to_dict(orient='records')

#     return jsonify({'comments': processed_comments})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)


# In[7]:


with open('sentiment_analyzer.pkl', 'wb') as file:
    pickle.dump(sentiments, file)