#!/usr/bin/env python
# coding: utf-8

# In[1]:


from flask import Flask, request, jsonify
import requests
import pandas as pd
import re
import string
import nltk
import spacy
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.utils import resample
import spacy

# Initialize SpaCy model
nlp = spacy.load("en_core_web_sm")



nltk.download('vader_lexicon')
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')


# In[3]:

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


# In[ ]:



# Function to filter meaningful comments
def is_meaningful(comment_text):
    # Process the text using SpaCy NLP
    doc = nlp(comment_text)

    # Example check: If the comment has less than 3 tokens or too many punctuation marks, consider it meaningless
    if len(doc) < 3 or sum([1 for token in doc if token.is_punct]) > len(doc) / 2:
        return False  # Meaningless comment
    return True  # Meaningful comment

@app.route('/api/v1/filter-comments', methods=['POST'])
def filter_comments():
    data = request.get_json()
    comments = data.get("comments", [])

    # Filter out meaningless comments
    filtered_comments = [comment for comment in comments if is_meaningful(comment)]

    return jsonify({"comments": filtered_comments})



@app.route('/api/v1/youtube-comments', methods=['POST'])
def process_comments():
    data = request.json
    comments = data.get("comments", [])

    if not comments:
        return jsonify({'error': 'No comments provided'}), 400

    df = pd.DataFrame(comments, columns=["Comment"])
    df = df.dropna(subset=["Comment"])


    df["Positive"] = df["Comment"].apply(lambda x: sentiments.polarity_scores(str(x))["pos"])
    df["Negative"] = df["Comment"].apply(lambda x: sentiments.polarity_scores(str(x))["neg"])
    df["Neutral"] = df["Comment"].apply(lambda x: sentiments.polarity_scores(str(x))["neu"])
    df['Compound'] = df["Comment"].apply(lambda x: sentiments.polarity_scores(str(x))["compound"])

    sentiment = []
    for score in df["Compound"]:
        if score >= 0.04:
            sentiment.append('Positive')
        elif score <= -0.05:
            sentiment.append('Negative')
        else:
            sentiment.append('Neutral')

    df["Sentiment"] = sentiment
    df = df.drop(['Positive', 'Negative', 'Neutral', 'Compound'], axis=1)
    df['Comment'] = df['Comment'].astype(str).apply(text_processing)

    le = LabelEncoder()
    df['Sentiment'] = le.fit_transform(df['Sentiment'])

    processed_comments = df[['Comment', 'Sentiment']].to_dict(orient='records')

    return jsonify({'comments': processed_comments})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

