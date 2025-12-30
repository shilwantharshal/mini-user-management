import re

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

def is_valid_email(email: str) -> bool:
    return re.match(EMAIL_REGEX, email) is not None

def is_strong_password(password: str) -> bool:
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    if not re.search(r"[!@#$%^&*()_+=\-]", password):
        return False
    return True
