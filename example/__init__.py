import time
from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

from flask_wire import Wire


db = SQLAlchemy()


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String(255), nullable=False)


class Config:
    SECRET_KEY = 'Some secret'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///wire.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    Wire(app)

    @app.before_first_request
    def init_db():
        with app.app_context():
            db.create_all()

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/header')
    def header():
        return '<h1>Header</h1>'

    @app.route('/sub_header')
    def sub_header():
        return '<h3>Sub Header</h3>'

    @app.route('/sub_waiting_header')
    def sub_sub_header():
        time.sleep(2)
        return '<h4>Waiting Header</h3>'

    @app.route('/another')
    def another_header():
        return '<h1>Another Header</h1>'

    @app.route('/messages')
    def messages_list():
        messages = Message.query.all()
        return render_template('messages.html', messages=messages)

    @app.route('/add_message', methods=('GET', 'POST'))
    def add_message():
        message = request.form['message']
        db.session.add(Message(content=message))
        db.session.commit()
        return redirect(url_for('.messages_list'))

    return app


if __name__ == '__main__':
    application = create_app()
    application.run()
