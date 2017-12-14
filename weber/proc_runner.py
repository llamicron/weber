import copy
import time
from brewer.controller import Controller

class ProcRunner:
    def __init__(self, proc):
        self.con = Controller()

        self.proc = proc
        self.proc.sort(key=lambda x: x['position'])
        self.fullProc = copy.deepcopy(self.proc)

    def next_step(self):
        """
        Pops off the step at the head of the list and runs it
        """
        if len(self.proc) < 1:
            return False
        self.run(self.proc.pop(0))
        return True

    def run(self, step):
        method = self.find_method(step)
        arg = self.find_args(step)

        if callable(method):
            method(arg)

    def find_method(self, step):
        methods = {
            "hlt": self.con.hlt,
            "pump": self.con.pump,
            "rims": self.con.pid,
            "hltDivert": self.con.hlt_to,
            "rimsDivert": self.con.rims_to,
            "sleep": time.sleep,
            "watch": self.con.watch,
            "slack": self.con.slack.send,
            "set_sv": self.con.set_sv
        }
        return methods[step['name']]

    def find_args(self, step):
        allowed_types = {
            "hlt": int,
            "pump": int,
            "rims": int,
            "hltDivert": str,
            "rimsDivert": str,
            "sleep": (int, float),
            "watch": None,
            "slack": str,
            "set_sv": (int, float)
        }

        if not allowed_types[step['name']]:
            return None

        if step['type'] == "divert":
            return 'mash' if int(step['value']) == 0 else 'boil'

        try:
            if isinstance(step['value'], allowed_types[step['name']]):
                return step['value']
            else:
                if isinstance(allowed_types[step['name']], tuple):
                    return allowed_types[step['name']][0](step['value'])
                return allowed_types[step['name']](step['value'])
        except (KeyError, ValueError):
            return None

    def remaining_steps(self):
        return self.proc
