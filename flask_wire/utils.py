from flask import url_for, request


def url_for_sync(endpoint, **values):
    """Adds query params in the current url to endpoint that will be generated.

    :param endpoint:
    :param values:
    :return:
    """
    if request.args:
        new_values = dict(request.args)
        new_values.update(values)
        return url_for(endpoint, **new_values)
    return url_for(endpoint, **values)

