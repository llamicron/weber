from flask import Flask, render_template, url_for
import os
import json

class CustomFlask(Flask):
  jinja_options = Flask.jinja_options.copy()
  jinja_options.update(dict(
    block_start_string='(%',
    block_end_string='%)',
    variable_start_string='((',
    variable_end_string='))',
    comment_start_string='(#',
    comment_end_string='#)',
  ))

app = CustomFlask(__name__)

@app.route('/')
def hello_world():
    return render_template("index.html")

@app.route('/data')
def send_JSON():
    return {'hello': 'world'}



@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


@app.route("/options", methods=["GET"])
def serve_options():
    with open("options.json", 'r') as file:
        return str(json.load(file))


if __name__ == '__main__':
    app.run()
