import json
from mtranslate import translate

# Function to translate the values of a JSON dictionary
def translate_values(json_data):
    translated_data = {}

    # Iterate over the keys and values of the JSON dictionary
    for key, value in json_data.items():
        # If the value is another dictionary, apply recursion
        if isinstance(value, dict):
            translated_data[key] = translate_values(value)
        # If the value is a string, translate using mtranslate
        elif isinstance(value, str):
            translated_data[key] = translate(value, 'pl', 'es')
            print(f'Translated value: {key} -> {translated_data[key]}')
        # If it is neither a string nor a dictionary, keep the value unchanged
        else:
            translated_data[key] = value

    return translated_data

# Open the input JSON file
with open('translation_input.json', 'r', encoding='utf-8') as file:
    json_data = json.load(file)

# Call the function to translate the values of the JSON
translated_data = translate_values(json_data)

# Write the new translated JSON
with open('translation_new.json', 'w', encoding='utf-8') as file:
    json.dump(translated_data, file, ensure_ascii=False, indent=4)

# Show completion message
print('Translation completed.')
