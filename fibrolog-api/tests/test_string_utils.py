from fibrolog_api.utils.string_utils import slugify


def test_slugify_basic():
    assert slugify("Hello World") == "hello_world"


def test_slugify_accents():
    assert slugify("Gustavo Henrique Aragão Silva") == "gustavo_henrique_aragao_silva"
    assert slugify("Çãõ é í ó ú") == "cao_e_i_o_u"


def test_slugify_special_chars():
    assert slugify("Hello! @World# 123") == "hello_world_123"


def test_slugify_multiple_spaces_and_underscores():
    assert slugify("hello   world") == "hello_world"
    assert slugify("___hello___world___") == "hello_world"


def test_slugify_empty_string():
    assert slugify("") == ""
    assert slugify(None) == ""
