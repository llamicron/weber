import json
import glob
import os

from flask import Flask, render_template, url_for, redirect, request
from brewer.controller import Controller
from json_handler import Handler
from proc_runner import ProcRunner


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
    return render_template("index.html")

@app.route('/controller')
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

@app.route('/set-sv', methods=["POST"])
def set_sv():
    sv = float(request.get_json()['sv'])
    if 0.0 < sv < 999.9:
        con.set_sv(sv)
        return "True"
    else:
        return "False"

@app.route('/slack', methods=["POST"])
def send_in_slack():
    message = request.get_json()['message']
    con.slack.send(message)
    return "True"

@app.route('/save-procedure', methods=["POST"])
def save_procedure():
    name = request.get_json()['name']
    items = request.get_json()['items']

    file_name = sanitize_filename(name, file_ending=".json")

    data = {
        "name": name,
        "items": items
    }
    with open('weber/data/procedures/' + file_name, 'w') as file:
        file.write(json.dumps(data, indent=4))
    return "True"

@app.route('/run-procedure', methods=["POST"])
def run_procedure():
    name = request.get_json()['name']
    file_name = "weber/data/procedures/"
    file_name += sanitize_filename(name, file_ending=".json")

    proc = json.load(open(file_name, 'r'))

    assert proc['name'] == name
    assert not proc['items'] == []

    app.runner = ProcRunner(proc['items'])
    return "True"

@app.route('/run-next-step', methods=["POST"])
def run_next_step():
    if not hasattr(app, 'runner'):
        return "False"
    app.runner.next_step()
    return json.dumps(app.runner.proc)


# Resources
@app.route("/items", methods=["GET"])
def serve_items():
    return json_handler.to_vue("items")


@app.route('/relay-list', methods=["GET"])
def serve_relay_list():
    return json_handler.to_vue("relays")


@app.route('/pid', methods=["GET"])
def serve_pid_data():
    return json.dumps(con.pid_status())

@app.route('/procedure-data', methods=["GET"])
def serve_procedure_data():
    file_list = glob.glob('weber/data/procedures' + '/*.json')
    procedures = []
    for file_path in file_list:
        if "testingprocedure" not in file_path:
            procedures.append(json.load(open(file_path)))
    return json.dumps(procedures)

@app.route('/current-step', methods=["GET"])
def serve_current_step():
    if not hasattr(app, 'runner'):
        return "False"
    return json.dumps(app.runner.proc)


@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path, endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


def sanitize_filename(string, **kwargs):
    file_ending = kwargs.get('file_ending', "")

    keepcharacters = ('.', '_', '-')
    almost_clean = "".join(c for c in string if c.isalnum() or c in keepcharacters).rstrip()
    file_name = almost_clean.replace(' ', '_').lower()
    file_name += file_ending
    return file_name

if __name__ == '__main__':
    app.run("0.0.0.0")
