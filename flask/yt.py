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


# In[7]:


with open('sentiment_analyzer.pkl', 'wb') as file:
    pickle.dump(sentiments, file)

