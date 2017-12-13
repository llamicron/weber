import copy
from brewer.controller import Controller

class ProcRunner:
    def __init__(self, proc):
        self.con = Controller()

        self.proc = proc
        self.proc.sort(key=lambda x: x['position'])

        self.python_proc = self.parse_proc(self.proc)
        self.fullProc = copy.deepcopy(self.proc)

    def next_step(self):
        """
        Pops off the step at the head of the list and runs it
        """
        self.run(self.proc.pop(0))

    def run(self, step):
        print(step)

    def parse_proc(self, proc):
        """
        Parses the json values returned from the front end into python methods and arguments
        """
        for item in proc:
            pass
        return []
