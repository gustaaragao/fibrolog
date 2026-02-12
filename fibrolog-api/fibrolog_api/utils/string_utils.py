import re
import unicodedata


def slugify(text: str) -> str:
    """
    Converts a string to a slug format: lowercase, no accents, spaces replaced by underscores.
    Example: 'Gustavo Henrique Aragão Silva' -> 'gustavo_henrique_aragao_silva'
    """
    if not text:
        return ""

    # Normalize unicode characters to decompose combined characters (like 'ã' to 'a' + '~')
    text = unicodedata.normalize('NFKD', text)

    # Encode to ASCII, ignoring errors (removes the accents), then decode back
    text = text.encode('ascii', 'ignore').decode('ascii')

    # Convert to lowercase
    text = text.lower()

    # Replace non-alphanumeric characters (except underscores) with underscores
    text = re.sub(r'[^a-z0-9_]+', '_', text)

    # Strip leading/trailing underscores
    text = text.strip('_')

    # Remove multiple consecutive underscores
    text = re.sub(r'_+', '_', text)

    return text
