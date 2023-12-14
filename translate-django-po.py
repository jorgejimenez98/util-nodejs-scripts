import polib
from mtranslate import translate
import os

# Function to translate a message using mtranslate
def translate_message(message):
    return translate(message, 'pl', 'en')

# Function to translate a Django PO file
def translate_django_po(polish_po_path):
    # Load the untranslated Polish PO file
    non_translated_polish_po = polib.pofile('./locale/pl/LC_MESSAGES/django.po')

    # Iterate over the entries in the PO file
    for entry in non_translated_polish_po:
        # Skip already translated entries
        if entry.translated():
            continue

        # Get the message to translate
        message_to_translate = entry.msgid

        try:
            # Translate the message and assign it to msgstr in the PO entry
            translated_message = translate_message(message_to_translate)
            entry.msgstr = translated_message or ""
            print({'Message': message_to_translate, 'Translated': translated_message})
        except Exception as e:
            # Handle translation errors
            print({'Message': message_to_translate, 'ERROR': e})

    # Save the translated PO file
    non_translated_polish_po.save(polish_po_path)

# Polish directory for Django PO files
polish_directory = './locale/pl/LC_MESSAGES/'

# Path to the new translated PO file
polish_po_path = os.path.join(polish_directory, 'django_new.po')

# Call the translation function
translate_django_po(polish_po_path)

# Show completion message
print('Translation completed.')
