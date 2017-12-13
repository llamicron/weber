import unittest
import json
import os
from pprint import pprint as print

from proc_runner import ProcRunner

class TestProcRunner(unittest.TestCase):
    def setUp(self):
        proc_file_name = os.path.dirname(os.path.abspath(__file__))
        proc_file_name += '/data/procedures/defaultprocedure.json'
        proc = json.load(open(proc_file_name, 'r'))
        self.runner = ProcRunner(proc['items'])

    def test_it_pops_off_a_step_when_it_runs_it(self):
        old_len = len(self.runner.proc)
        assert old_len > 2
        self.runner.next_step()
        assert len(self.runner.proc) == (old_len - 1)

    def test_it_parses_steps_into_python(self):
        pass


