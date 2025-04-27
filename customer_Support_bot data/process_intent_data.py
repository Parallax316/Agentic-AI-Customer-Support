import os
import json
import re
import pandas as pd
from sklearn.model_selection import train_test_split

# Configuration
DATA_DIR = os.path.join('customer_Support_bot data', 'intent')
OUTPUT_DIR = 'data_processed'
TEST_SIZE = 0.2
RANDOM_STATE = 42

def clean_text(text):
    # Remove special characters and extra spaces
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text.lower()

def load_intent_data():
    datasets = []
    files = ['complaints.json', 'faqs.json', 'troubleshooting.json']
    
    for file in files:
        path = os.path.join(DATA_DIR, file)
        try:
            with open(path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                # Extract first key which contains the array
                key = list(data.keys())[0]
                for entry in data[key]:
                    datasets.append({
                        'text': clean_text(entry['query']),
                        'intent': entry['intent']
                    })
        except Exception as e:
            print(f'Error loading {file}: {str(e)}')
    return pd.DataFrame(datasets)

def main():
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Load and process data
    df = load_intent_data()
    
    # Stratified split
    train_df, test_df = train_test_split(
        df, 
        test_size=TEST_SIZE,
        stratify=df['intent'],
        random_state=RANDOM_STATE
    )
    
    # Save datasets
    train_df.to_csv(os.path.join(OUTPUT_DIR, 'train.csv'), index=False)
    test_df.to_csv(os.path.join(OUTPUT_DIR, 'test.csv'), index=False)
    print(f'Data processing complete. Train: {len(train_df)}, Test: {len(test_df)}')

if __name__ == '__main__':
    main()