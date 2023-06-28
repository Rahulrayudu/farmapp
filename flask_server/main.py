from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np
import os
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import requests
import joblib
import re
import string
import pandas as pd

app = Flask(__name__)
CORS(app)

model = load_model('models/new_plant_disease_detection_1.h5')
classes = ['Apple___Apple_scab',
           'Apple___Black_rot',
           'Apple___Cedar_apple_rust',
           'Apple___healthy',
           'Blueberry___healthy',
           'Cherry_(including_sour)___Powdery_mildew',
           'Cherry_(including_sour)___healthy',
           'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
           'Corn_(maize)___Common_rust_',
           'Corn_(maize)___Northern_Leaf_Blight',
           'Corn_(maize)___healthy',
           'Grape___Black_rot',
           'Grape___Esca_(Black_Measles)',
           'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
           'Grape___healthy',
           'Orange___Haunglongbing_(Citrus_greening)',
           'Peach___Bacterial_spot',
           'Peach___healthy',
           'Pepper,_bell___Bacterial_spot',
           'Pepper,_bell___healthy',
           'Potato___Early_blight',
           'Potato___Late_blight',
           'Potato___healthy',
           'Raspberry___healthy',
           'Soybean___healthy',
           'Squash___Powdery_mildew',
           'Strawberry___Leaf_scorch',
           'Strawberry___healthy',
           'Tomato___Bacterial_spot',
           'Tomato___Early_blight',
           'Tomato___Late_blight',
           'Tomato___Leaf_Mold',
           'Tomato___Septoria_leaf_spot',
           'Tomato___Spider_mites Two-spotted_spider_mite',
           'Tomato___Target_Spot',
           'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
           'Tomato___Tomato_mosaic_virus',
           'Tomato___healthy']


@app.route('/file-info', methods=['POST'])
def get_file_info():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file received'})
    image_file = request.files['image']
    try:
        img = Image.open(image_file)
        img = img.resize((224, 224))
        x = image.img_to_array(img)
        x = np.expand_dims(x, axis=0)
        x = x / 255.0

        pred_probs = model.predict(x)[0]
        top3_idx = pred_probs.argsort()[-3:][::-1]
        top3_classes = [classes[i] for i in top3_idx]
        top3_probs = [pred_probs[i] for i in top3_idx]

        response = {
            'class1': top3_classes[0],
            'class2': top3_classes[1],
            'class3': top3_classes[2],
            'prob1': float(top3_probs[0]),
            'prob2': float(top3_probs[1]),
            'prob3': float(top3_probs[2]),
            'type': 'image',
        }
        response = jsonify(response)
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        return response

    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    api_key = 'c4e5d78030ff473da1a173454231306'  # Replace with your actual API key

    if not city:
        return jsonify({'error': 'City parameter is missing.'}), 400

    # Make a request to the weather API with the provided city
    url = f'http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={city}&days=3'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        forecast = {
            'city': data['location']['name'],
            'forecast': []
        }

        for day in data['forecast']['forecastday'][:3]:  # Limit forecast to 3 days
            forecast_data = {
                'date': day['date'],
                'temperature': day['day']['avgtemp_c'],
                'description': day['day']['condition']['text'],
                'chance_of_rain': day['day']['daily_chance_of_rain'],
                'sunrise': day['astro']['sunrise'],
                'sunset': day['astro']['sunset']
            }
            forecast['forecast'].append(forecast_data)

        return jsonify(forecast), 200
    else:
        return jsonify({'error': 'Unable to fetch weather data.'}), response.status_code


# Load artifacts
model_chat = load_model('models/chat_Rnn_model/AI_lstm_model.h5')
tokenizer_t = joblib.load('models/chat_Rnn_model/tokenizer_t.pkl')
vocab = joblib.load('models/chat_Rnn_model/vocab.pkl')
df2 = pd.read_csv('models/chat_Rnn_model/response.csv')  # Assuming you have a CSV file containing responses


def tokenizer(entry):
    tokens = entry.split()
    re_punc = re.compile('[%s]' % re.escape(string.punctuation))
    tokens = [re_punc.sub('', w) for w in tokens]
    tokens = [word for word in tokens if word.isalpha()]
    tokens = [word.lower() for word in tokens if len(word) > 1]
    return tokens


def remove_stop_words_for_input(tokenizer, df, feature):
    doc_without_stopwords = []
    entry = df[feature][0]
    tokens = tokenizer(entry)
    doc_without_stopwords.append(' '.join(tokens))
    df[feature] = doc_without_stopwords
    return df


def encode_input_text(tokenizer_t, df, feature):
    t = tokenizer_t
    entry = [df[feature][0]]
    encoded = t.texts_to_sequences(entry)
    padded = pad_sequences(encoded, maxlen=8, padding='post')
    return padded


def get_pred(model, encoded_input):
    pred = np.argmax(model.predict(encoded_input))
    return pred


def bot_precausion(df_input, pred):
    words = df_input.questions[0].split()
    if len([w for w in words if w in vocab]) == 0:
        pred = 1
    return pred


def get_response(df2, pred):
    upper_bound = df2.groupby('labels').get_group(pred).shape[0]
    r = np.random.randint(0, upper_bound)
    responses = list(df2.groupby('labels').get_group(pred).response)
    return responses[r]


@app.route('/ai_bot', methods=['POST'])
def process_message():
    data = request.get_json()
    input_text = data['message']
    df_input = get_text(input_text)
    df_input = remove_stop_words_for_input(tokenizer, df_input, 'questions')
    encoded_input = encode_input_text(tokenizer_t, df_input, 'questions')
    pred = get_pred(model_chat, encoded_input)
    pred = bot_precausion(df_input, pred)
    response = get_response(df2, pred)
    return jsonify({'response': response})


def get_text(str_text):
    input_text = [str_text]
    df_input = pd.DataFrame(input_text, columns=['questions'])
    return df_input


if __name__ == '__main__':
    app.run(debug=True)
