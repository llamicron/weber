import json
from brewer.controller import Controller

class Handler():
    def __init__(self):
        self.files = {
            'relays': 'relays.json',
            'pid': 'pid.json',
            'items': 'items.json'
        }
        self.data_dir = "weber/data/"
        self.con = Controller.simulator()

    def update_relays(self):
        """
        Updates all the live data in relays.json
        """
        # Get the json model and update it's values
        with open(self.data_dir + self.files['relays'], 'r') as file:
            data = json.load(file)
            for relay in data['relays']:
                if relay['name'] == 'rims':
                    relay['state'] = self.con.pid_status()['pid_running']
                else:
                    relay['state'] = self.con.relay_status(self.con.settings.relays[relay['name']])

        # Write the json model back to the file
        with open(self.data_dir + self.files['relays'], 'w') as file:
            json.dump(data, file, indent=2)


    def to_vue(self, file):
        with open(self.data_dir + self.files[file], 'r') as file:
            return json.dumps(json.load(file))
