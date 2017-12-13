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
        if step['class'] == "Controller":
            method = getattr(Controller, step['method'])
            if not callable(method):
                raise

            if not 'value' in step.keys():
                method(self.con)

            if step['type'] == 'binary':
                step['value'] = int(step['value'])
                assert step['value'] in (1, 0)
            elif step['type'] == 'divert':
                step['value'] = str(step['value'])
                step['value'] = str(step['locationVerbage'][step['value']])
                assert step['value'] in ('mash', 'boil')
            elif step['type'] == 'method':
                if step['inputType'] == "text":
                    step['value'] = str(step['value'])
                elif step['inputType'] == "tel":
                    step['value'] = int(step['value'])

            method(self.con, step['value'])

        elif step['class'] == "time":
            method = getattr(time, step['method'])
            if callable(method):
                method(int(step['value']))
