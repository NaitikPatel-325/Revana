#!/usr/bin/env python
# coding: utf-8

# In[2]:


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


# In[3]:


nltk.download('vader_lexicon')
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')


# In[4]:


app = Flask(__name__)
sentiments = SentimentIntensityAnalyzer()
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
file_path = "amazon_vfl_reviews.xls"  

def text_processing(text):
    text = text.lower()
    text = re.sub(r'\n', ' ', text)
    text = re.sub(f'[{re.escape(string.punctuation)}]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


# In[5]:


@app.route('/api/v1/youtube-comments', methods=['POST'])
def process_comments():
    data = request.json
    comments = data.get("comments", [])

    if not comments:
        return jsonify({'error': 'No comments provided'}), 400

    df = pd.DataFrame(comments, columns=["Comment"])
    df = df.dropna(subset=["Comment"])
    df['Comment'] = df['Comment'].astype(str).apply(text_processing)

    # Sentiment Analysis
    df["Compound"] = df["Comment"].apply(lambda x: sentiments.polarity_scores(x)["compound"])

    # Classify Sentiment
    df["Sentiment"] = df["Compound"].apply(lambda x: 'Positive' if x >= 0.05 else 'Negative' if x <= -0.05 else 'Neutral')

    # Encode Sentiments
    le = LabelEncoder()
    df['Sentiment'] = le.fit_transform(df['Sentiment'])

    processed_comments = df[['Comment', 'Sentiment']].to_dict(orient='records')
    return jsonify({'comments': processed_comments})


@app.route('/api/v1/amazon-reviews', methods=['GET'])
def get_reviews_by_asin():
    asin = request.args.get('asin')
    print(asin)
    if not asin:
        return jsonify({"error": "ASIN parameter is required"}), 400

    try:
        # Read the Excel file instead of CSV
        df = pd.read_excel(file_path, dtype=str)
        print(df.columns)
        # Find the ASIN column
        asin_column = next((col for col in df.columns if "asin" in col.lower()), None)

        if not asin_column:
            return jsonify({"error": "ASIN column not found"}), 400

        # Filter data based on ASIN
        filtered_df = df[df[asin_column] == asin]

        if filtered_df.empty:
            return jsonify({"error": "No data found for this ASIN"}), 404

        # Apply sentiment analysis
        filtered_df['Review'] = filtered_df['Review'].astype(str).apply(text_processing)
        filtered_df["Compound"] = filtered_df["Review"].apply(lambda x: sentiments.polarity_scores(x)["compound"])

        # Classify Sentiment
        filtered_df["Sentiment"] = filtered_df["Compound"].apply(
            lambda x: 'Positive' if x >= 0.05 else 'Negative' if x <= -0.05 else 'Neutral'
        )

        # Drop unnecessary columns
        filtered_df.drop(['Compound'], axis=1, inplace=True)

        # Return the result
        output = filtered_df.to_dict(orient="records")
        return jsonify(output)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)


# In[ ]:


with open('sentiment_analyzer.pkl', 'wb') as file:
    pickle.dump(sentiments, file)

