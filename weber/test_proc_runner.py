import unittest
import json
import os
import pytest
from pprint import pprint as print

from proc_runner import ProcRunner
from brewer.controller import Controller
from brewer.fake_controller import FakeController

class TestProcRunner(unittest.TestCase):
    def setUp(self):
        proc_file_name = os.path.dirname(os.path.abspath(__file__))
        proc_file_name += '/data/procedures/testingprocedure.json'
        proc = json.load(open(proc_file_name, 'r'))
        self.runner = ProcRunner(proc['items'])


    def test_it_pops_off_a_step_when_it_runs_it(self):
        old_len = len(self.runner.proc)
        assert old_len > 2
        self.runner.next_step()
        assert len(self.runner.proc) == (old_len - 1)

    def test_assert_see_con_changes(self):
        assert isinstance(self.runner.con, (FakeController, Controller))
        self.runner.con.hlt(0)
        # So many nested modules... I do apologize
        # Gets the relay status of the hlt
        assert self.runner.con.relay_status(self.runner.con.settings.relays['hlt']) == 0

        self.runner.con.hlt(1)
        assert self.runner.con.relay_status(self.runner.con.settings.relays['hlt']) == 1

        self.runner.con.pid(1)
        assert self.runner.con.pid_status()['pid_running']
        self.runner.con.pid(0)
        assert not self.runner.con.pid_status()['pid_running']


    def test_it_can_run_steps(self):
        items = [{
            "type": "binary",
            "name": "hlt",
            "state": 0,
            "icon": "camera",
            "stateVerbage": {
                "1": "open",
                "0": "closed"
            },
            "method": "hlt",
            "position": "0",
            "class": "Controller",
            "prettyName": "HLT Valve",
            "value": 0
        }]
        self.runner = ProcRunner(items)
        self.runner.con.hlt(1)
        assert self.runner.con.relay_status(self.runner.con.settings.relays['hlt']) == 1
        self.runner.next_step()
        assert self.runner.con.relay_status(self.runner.con.settings.relays['hlt']) == 0

    def test_full_proc(self):
        for i in range(len(self.runner.proc)):
            self.runner.next_step()

    def test_find_args(self):
        # This is the only relevant info
        item = {
            'type': 'binary',
            'name': 'hlt',
            'value': 1
        }
        assert self.runner.find_args(item) == item['value']

        item = {
            'type': 'binary',
            'name': 'hlt',
            'value': '1'
        }
        assert self.runner.find_args(item) == 1
        assert not self.runner.find_args(item) == '1'

        item = {
            'type': 'divert',
            'name': 'rimsDivert',
            'value': 1
        }
        assert self.runner.find_args(item) == 'boil'

        item = {
            'type': 'method',
            'name': 'watch'
        }
        assert self.runner.find_args(item) == None

        item = {
            'type': 'method',
            'name': 'slack',
            'value': 790
        }
        assert self.runner.find_args(item) == '790'
        assert not self.runner.find_args(item) == 790

        item = {
            'type': 'method',
            'name': 'sleep',
            'value': "14"
        }
        assert not self.runner.find_args(item) == "14"

        item = {
            'type': 'method',
            'name': 'watch',
            'value': None
        }
        assert self.runner.find_args(item) == None

    @pytest.mark.thisone
    def test_find_method(self):
        assert True
