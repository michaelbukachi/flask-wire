from flask import Blueprint, url_for, request
from markupsafe import Markup


class Wire:

    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        if not hasattr(app, 'extensions'):
            app.extensions = {}
        app.extensions['wire'] = self

        blueprint = Blueprint('wire', __name__, template_folder='templates',
                              static_folder='static', static_url_path='/wire' + app.static_url_path)
        app.register_blueprint(blueprint)

        app.jinja_env.globals['wire'] = self

        @app.after_request
        def modify_headers(response):
            response.headers.add('X-Request-URL', request.url)
            return response

    @staticmethod
    def load_js():
        src = url_for('wire.static', filename='js/bundle.js')
        js = f'<script src="{src}"></script>'
        return Markup(f'{js}')
