import copy
from brewer.controller import Controller

class ProcRunner:
    def __init__(self, proc):
        con = Controller()
        self.proc = proc
        self.fullProc = copy.deepcopy(proc)

    def run_next_step(self):
        self.run(self.proc.pop(0))

    def run(step):
        print(step)
