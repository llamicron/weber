from flask import Flask, render_template, url_for, redirect, request
import os
from brewer.controller import Controller
from json_handler import Handler
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
con = Controller()
json_handler = Handler()

@app.route('/')
def index():
    return render_template("controller.html")

@app.route('/controller', methods=["GET"])
def redirect_home():
    return redirect("/")


@app.route('/procedures')
def procedures():
    return render_template("procedures.html")

@app.route('/set-relay', methods=["POST"])
def set_relay():
    relay = request.get_json()['relay']
    method = relay['method']

    run = getattr(con, method['name'])


    if relay['state'] == 1:
        run(method['offArg'])
    else:
        run(method['onArg'])

    json_handler.update_relays()

    return "True"


# Resources
@app.route("/items", methods=["GET"])
def serve_items():
    with open("weber/data/items.json", 'r') as file:
        return json.dumps(json.load(file))


@app.route('/relay-list', methods=["GET"])
def serve_relay_list():
    with open('weber/data/relays.json', 'r') as file:
        return json.dumps(json.load(file))


@app.route('/pid', methods=["GET"])
def serve_pid_data():
    with open('weber/data/pid_test_data.json', 'r') as file:
        return json.dumps(json.load(file))





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




if __name__ == '__main__':
    app.run("0.0.0.0")
